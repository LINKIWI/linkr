import config
import mock

import util.recaptcha
import util.response
from test.backend.factory import LinkFactory
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from uri.user import *


class TestUser(LinkrTestCase):
    def test_api_add_new_user_registration_disabled(self):
        config.options.server['allow_open_registration'] = False

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json['failure'], 'failure_open_registration_disabled')

    def test_api_add_new_user_unauth_new_admin(self):
        config.options.server['allow_open_registration'] = True

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
            'is_admin': True,
        })

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_add_new_user_non_admin_new_admin(self):
        config.options.server['allow_open_registration'] = True

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserAddURI, data={
                'username': 'username',
                'password': 'password',
                'is_admin': True,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_add_new_user_unavailable_username(self):
        config.options.server['allow_open_registration'] = True
        UserFactory.generate(username='username')

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 409)
        self.assertEqual(resp.json['failure'], 'failure_unavailable_username')

    def test_api_add_new_user_invalid_username(self):
        config.options.server['allow_open_registration'] = True

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username with spaces',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json['failure'], 'failure_invalid_username')

    def test_api_add_new_user_valid(self):
        config.options.server['allow_open_registration'] = True

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json['username'], 'username')

    def test_api_add_new_user_undefined_error(self):
        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(UserAddURI, data={
                'username': 'username',
                'password': 'password',
            })

            self.assertTrue(self.api_utils.is_undefined_error(resp))
