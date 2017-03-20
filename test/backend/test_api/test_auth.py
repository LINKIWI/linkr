import mock

import util.response
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from uri.auth import AuthCheckURI, AuthLoginURI, AuthLogoutURI


class TestAuth(LinkrTestCase):
    def test_api_auth_check_unauth(self):
        resp = self.api_utils.request(AuthCheckURI)

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_unauthenticated')

    def test_api_auth_check_undefined_error(self):
        with mock.patch.object(util.response, 'error') as mock_error:
            mock_error.side_effect = ValueError

            resp = self.api_utils.request(AuthCheckURI)

            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_auth_check_auth(self):
        with self.api_utils.authenticated_user() as user:
            resp = self.api_utils.request(AuthCheckURI)

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user'], user.as_dict())

    def test_api_auth_login_invalid_auth(self):
        UserFactory.generate(username='username', password='password')
        resp = self.api_utils.request(AuthLoginURI, data={
            'username': 'username',
            'password': 'invalid',
            'remember_me': False,
        })

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_invalid_auth')

    def test_api_auth_login_nonexistent_user(self):
        resp = self.api_utils.request(AuthLoginURI, data={
            'username': 'username',
            'password': 'invalid',
            'remember_me': False,
        })

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json['failure'], 'failure_nonexistent_user')

    def test_api_auth_login_undefined_error(self):
        UserFactory.generate(username='username', password='password')
        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(AuthLoginURI, data={
                'username': 'username',
                'password': 'password',
                'remember_me': False,
            })

            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_auth_login_valid(self):
        UserFactory.generate(username='username', password='password')
        resp = self.api_utils.request(AuthLoginURI, data={
            'username': 'username',
            'password': 'password',
            'remember_me': False,
        })

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json['username'], 'username')

    def test_api_auth_logout_undefined_error(self):
        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(AuthLogoutURI)

            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_auth_logout_valid(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(AuthLogoutURI)

            self.assertEqual(resp.status_code, 200)
