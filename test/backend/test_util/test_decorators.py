import linkr  # flake8: noqa: F401

import mock
import json
import flask_login

import time
import threading
from linkr import cache
import util.decorators
from linkr import app
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from test.backend.test_case import mock_config_options
import util.cache


class TestDecorators(LinkrTestCase):
    _multiprocess_can_split_ = True

    @mock_config_options(server={'secure_frontend_requests': True})
    def test_api_method_simple(self):
        @util.decorators.api_method
        def simple():
            return 'simple', 200

        request_headers = {
            'Cookie': '{name}={value}'.format(name=util.decorators.COOKIE_SPA_TOKEN, value='abc'),
        }

        with app.test_request_context(headers=request_headers):
            with mock.patch.object(cache, 'set') as mock_set, \
                 mock.patch.object(cache, 'delete') as mock_delete, \
                 mock.patch.object(time, 'sleep') as mock_sleep, \
                 mock.patch.object(threading, 'Thread') as mock_thread:
                simple()

                _, kwargs = mock_thread.call_args
                task = kwargs['target']
                task()  # Manually execute async task

                self.assertEqual(mock_set.call_count, 1)
                self.assertEqual(mock_sleep.call_count, 1)
                self.assertEqual(mock_delete.call_count, 1)

    def test_require_form_args_simple(self):
        @util.decorators.require_form_args(['arg1', 'arg2'])
        def simple(data):
            return data

        with app.test_request_context(data=json.dumps({'arg1': 'value', 'arg2': 'other'})):
            data = simple()
            self.assertEqual(data['arg1'], 'value')
            self.assertEqual(data['arg2'], 'other')

    def test_require_form_args_missing(self):
        @util.decorators.require_form_args(['arg1', 'arg2'])
        def missing_args(data):
            return data

        with app.test_request_context(data=json.dumps({'arg1': 'value'})):
            resp, status = missing_args()
            self.assertEqual(status, 400)
            self.assertEqual(resp.json['failure'], 'failure_incomplete_params')

    def test_require_form_args_blank_values(self):
        @util.decorators.require_form_args(['arg1'], allow_blank_values=True)
        def blank_values(data):
            return data

        with app.test_request_context(data=json.dumps({'arg1': ''})):
            data = blank_values()
            self.assertEqual(data['arg1'], '')

    def test_require_form_args_strict_params(self):
        @util.decorators.require_form_args(['arg1'], strict_params=True)
        def strict_params(data):
            return data

        with app.test_request_context(data=json.dumps({'arg1': 'a', 'arg2': 'b'})):
            resp, status = strict_params()
            self.assertEqual(status, 400)
            self.assertEqual(resp.json['failure'], 'failure_incomplete_params')

    def test_require_login_api_unauth(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api()
        def unauth(data):
            return 'resp'

        resp, status = unauth()

        self.assertEqual(status, 403)
        self.assertFalse(resp.json['success'])
        self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_require_login_api_admin_only_unauth(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api(admin_only=True)
        def admin_only_unauth(data):
            return 'resp'

        flask_login.login_user(UserFactory.generate(is_admin=False))
        resp, status = admin_only_unauth()

        self.assertEqual(status, 403)
        self.assertFalse(resp.json['success'])
        self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_require_login_api_login_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api()
        def login_auth(data):
            return 'resp'

        flask_login.login_user(UserFactory.generate())
        self.assertEqual(login_auth(), 'resp')

    def test_require_login_api_api_key_header_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api()
        def api_key_auth(data):
            return 'resp'

        user = UserFactory.generate()
        with app.test_request_context(headers={'X-Linkr-Key': user.api_key}):
            self.assertEqual(api_key_auth(), 'resp')

    def test_require_login_api_api_key_data_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api()
        def api_key_auth(data):
            return 'resp'

        user = UserFactory.generate()
        with app.test_request_context(data=json.dumps({'api_key': user.api_key})):
            self.assertEqual(api_key_auth(), 'resp')

    def test_require_login_api_api_key_invalid(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api()
        def api_key_invalid(data):
            return 'resp'

        user = UserFactory.generate()
        with app.test_request_context(headers={'X-Linkr-Key': user.api_key + 'a'}):
            resp, status = api_key_invalid()
            self.assertEqual(status, 401)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_require_login_api_api_key_admin_only_regular_user(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api(admin_only=True)
        def api_key_admin_only_regular_user(data):
            return 'resp'

        user = UserFactory.generate(is_admin=False)
        with app.test_request_context(headers={'X-Linkr-Key': user.api_key}):
            resp, status = api_key_admin_only_regular_user()
            self.assertEqual(status, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_require_login_api_api_key_admin_only_admin_user(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api(admin_only=True)
        def api_key_admin_only_admin_user(data):
            return 'resp'

        user = UserFactory.generate(is_admin=True)
        with app.test_request_context(headers={'X-Linkr-Key': user.api_key}):
            self.assertEqual(api_key_admin_only_admin_user(), 'resp')

    def test_require_login_api_only_if(self):
        @util.decorators.require_form_args()
        @util.decorators.require_login_api(only_if=False)
        def only_if(data):
            return 'resp'

        # Should always return regardless of authentication status
        self.assertEqual(only_if(), 'resp')

    def test_optional_login_api_login_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.optional_login_api
        def login_auth(data):
            if flask_login.current_user.is_authenticated:
                return 'resp'

        # Noop in this case
        flask_login.login_user(UserFactory.generate())
        self.assertEqual(login_auth(), 'resp')

    def test_optional_login_api_api_key_header_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.optional_login_api
        def api_key_auth(data):
            if flask_login.current_user.is_authenticated:
                return 'resp'

        user = UserFactory.generate()
        with app.test_request_context(headers={'X-Linkr-Key': user.api_key}):
            self.assertEqual(api_key_auth(), 'resp')

    def test_optional_login_api_api_key_data_auth(self):
        @util.decorators.require_form_args()
        @util.decorators.optional_login_api
        def api_key_auth(data):
            if flask_login.current_user.is_authenticated:
                return 'resp'

        user = UserFactory.generate()
        with app.test_request_context(data=json.dumps({'api_key': user.api_key})):
            self.assertEqual(api_key_auth(), 'resp')

    def test_optional_login_api_api_key_invalid(self):
        @util.decorators.require_form_args()
        @util.decorators.optional_login_api
        def api_key_invalid(data):
            if flask_login.current_user.is_authenticated:
                return 'resp'

        with app.test_request_context(headers={'X-Linkr-Key': 'invalid'}):
            self.assertIsNone(api_key_invalid())

    @mock_config_options(server={'secure_frontend_requests': True})
    def test_require_frontend_api_invalid(self):
        @util.decorators.require_form_args()
        @util.decorators.require_frontend_api
        def require_frontend_api_invalid(data):
            return 'invalid', 400

        with app.test_request_context():
            with mock.patch.object(cache, 'get') as mock_get:
                mock_get.return_value = False

                resp, status = require_frontend_api_invalid()

                self.assertEqual(mock_get.call_count, 1)
                self.assertEqual(resp.json['failure'], 'failure_bad_client')
                self.assertEqual(status, 403)

    @mock_config_options(server={'secure_frontend_requests': True})
    def test_require_frontend_api_valid(self):
        @util.decorators.require_form_args()
        @util.decorators.require_frontend_api
        def require_frontend_api_valid(data):
            return 'valid', 200

        with app.test_request_context():
            with mock.patch.object(cache, 'get') as mock_get:
                mock_get.return_value = True

                text, status = require_frontend_api_valid()

                self.assertEqual(text, 'valid')
                self.assertEqual(status, 200)
