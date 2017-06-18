import json
from contextlib import contextmanager
from functools import wraps

import mock
from flask_testing import TestCase

import config
import util.config_io
import util.response
from linkr import app
from linkr import db
from test.backend.factory import UserFactory
from uri.auth import AuthLoginURI
from uri.auth import AuthLogoutURI


client_options = config.options.client('')
server_options = config.options.server('')
test_client_options = {
    'piwik': {
        'url': None,
        'siteId': None,
    },
    'enable_recent_links': True,
}
test_server_options = {
    'linkr_url': 'http://localhost:5000',
    'require_login_to_create': False,
    'allow_open_registration': True,
    'secure_frontend_requests': False,
}


class LinkrTestCase(TestCase):
    """
    Generic subclass of TestCase with Linkr-specific test environment initialization for database
    testing.
    """

    def create_app(self):
        """
        Initializes the test Flask application by setting the app config parameters appropriately.
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'

        return app

    def setUp(self):
        """
        Initialize a test database environment.
        """
        self.client = app.test_client()
        self.api_utils = LinkrAPITestUtils(self.client)

        def mock_client_options(key):
            return util.config_io.get_property(test_client_options, key.split('.'))

        def mock_server_options(key):
            return util.config_io.get_property(test_server_options, key.split('.'))

        # Patch all config options to default to test-specific options, valid only throughout the
        # lifetime of this unit test.
        client_patch = mock.patch.object(config.options, 'client', side_effect=mock_client_options)
        server_patch = mock.patch.object(config.options, 'server', side_effect=mock_server_options)
        self.addCleanup(client_patch.stop)
        self.addCleanup(server_patch.stop)
        client_patch.start()
        server_patch.start()

        db.create_all()

    def tearDown(self):
        """
        Destroys the test database environment, resetting it to a clean state.
        """
        db.session.remove()
        db.drop_all()


class LinkrAPITestUtils:
    """
    Utility methods to abstract out common API test procedures.
    """

    def __init__(self, client):
        """
        Initialize the test utilities with a test client.

        :param client: The Flask test client for making requests.
        """
        self.client = client

    def request(self, uri_class, uri_params={}, data={}):
        """
        Make a request to a URI with the specified parameters (for construction of the URI) and
        JSON data.

        :param uri_class: The URI class to which a request should be made.
        :param uri_params: An optional dictionary describing how the URI should be constructed.
        :param data: An optional dictionary of JSON data to include in the request body to the URI.
        :return: The response object created from the request.
        """
        def mock_server_options(key):
            return util.config_io.get_property(server_options, key.split('.'))

        # The Flask route definitions are generated immediately at runtime, before the tests have an
        # opportunity to initialize. Depending on how the user has configured
        # secure_frontend_requests, the test-time generation of a path may differ from what Flask
        # registered during initialization. For this reason, *only when generating a request URI*,
        # we will simulate the original user-defined server-side config options.
        with mock.patch.object(config.options, 'server', side_effect=mock_server_options):
            uri_method = uri_class.methods[0].lower()
            path = uri_class.uri(*uri_params)

        return getattr(self.client, uri_method)(
            path,
            data=json.dumps(data),
            content_type='application/json',
        )

    @contextmanager
    def authenticated_user(self, *args, **kwargs):
        """
        Context manager for wrapping an API request with a logged in user, so that the request is
        made in an authenticated context. All arguments are transparently passed to the user
        generation factory function.

        :return: The user object that was authenticated to the endpoint.
        """
        auth_user = UserFactory.generate(password='password', *args, **kwargs)
        self.request(AuthLoginURI, data={
            'username': auth_user.username,
            'password': kwargs.get('password', 'password'),
            'remember_me': False,
        })

        yield auth_user

        self.request(AuthLogoutURI)

    @staticmethod
    def is_undefined_error(resp):
        """
        Check whether the specified API response is for a generic, undefined server-side error.

        :param resp: The response object created by request().
        :return: True if the response is for an undefined error; False otherwise.
        """
        error_resp, status = util.response.undefined_error()

        return resp.status_code == 500 and resp.json == error_resp.json


def mock_config_options(client={}, server={}):
    """
    Run a particular test with config option overrides. This function should decorate test functions
    that require a config option override for the duration of that test only, e.g.

      @mock_config_options(server={'allow_open_registration': False})
      def test_cannot_register_publicly(self):
          pass

    :param client: Dictionary of client option overrides.
    :param server: Dictionary of server option overrides.
    """
    def mock_client_options(key):
        return util.config_io.get_property(
            dict(test_client_options, **client),
            key.split('.'),
        )

    def mock_server_options(key):
        return util.config_io.get_property(
            dict(test_server_options, **server),
            key.split('.'),
        )

    def decorator(func):
        @wraps(func)
        def mock_config_values(*args, **kwargs):
            with mock.patch.object(config.options, 'client', side_effect=mock_client_options), \
                 mock.patch.object(config.options, 'server', side_effect=mock_server_options):
                return func(*args, **kwargs)

        return mock_config_values

    return decorator
