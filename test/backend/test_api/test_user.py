import config
import mock

import database.user
import util.recaptcha
import util.response
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from uri.auth import *
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

    def test_api_deactivate_user_nonexistent(self):
        user = UserFactory.generate()

        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(UserDeactivationURI, data={
                'user_id': user.user_id,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user_id'], user.user_id)

            resp = self.api_utils.request(UserDeactivationURI, data={
                'user_id': user.user_id,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_user')

    def test_api_deactivate_user_unauth(self):
        user = UserFactory.generate()

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserDeactivationURI, data={
                'user_id': user.user_id,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_deactivate_user_by_id(self):
        with self.api_utils.authenticated_user() as user:
            # User should initially be authenticated
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 200)

            # Actual account deactivation
            resp = self.api_utils.request(UserDeactivationURI, data={
                'user_id': user.user_id,
            })
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user_id'], user.user_id)

            # User should no longer be authenticated after deleting his or her own account
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 401)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_deactivate_user_admin(self):
        user = UserFactory.generate()

        with self.api_utils.authenticated_user(is_admin=True) as admin:
            # Admin should initially be authenticated
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 200)

            # Actual account deactivation of someone else's account
            resp = self.api_utils.request(UserDeactivationURI, data={
                'user_id': user.user_id,
            })
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user_id'], user.user_id)

            # Admin should still be authenticated since his or her account was not affected
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 200)

    def test_api_deactivate_user_current_user(self):
        with self.api_utils.authenticated_user() as user:
            # User should initially be authenticated
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 200)

            # Actual account deactivation
            resp = self.api_utils.request(UserDeactivationURI)
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user_id'], user.user_id)

            # User should no longer be authenticated after deleting his or her own account
            resp = self.api_utils.request(AuthCheckURI)
            self.assertEqual(resp.status_code, 401)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_deactivate_user_undefined_error(self):
        with self.api_utils.authenticated_user():
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(UserDeactivationURI)
                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_update_user_password_invalid_auth(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserUpdatePasswordURI, data={
                'current_password': 'bad password',
                'new_password': 'new password',
            })

            self.assertEqual(resp.status_code, 401)
            self.assertEqual(resp.json['failure'], 'failure_invalid_auth')

    def test_api_update_user_password_valid(self):
        with self.api_utils.authenticated_user(username='username'):
            resp = self.api_utils.request(UserUpdatePasswordURI, data={
                'current_password': 'password',
                'new_password': 'new password',
            })

            self.assertEqual(resp.status_code, 200)

        resp = self.api_utils.request(AuthLoginURI, data={
            'username': 'username',
            'password': 'new password',
            'remember_me': False,
        })

        self.assertEqual(resp.status_code, 200)

    def test_api_update_user_password_undefined_error(self):
        with self.api_utils.authenticated_user():
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(UserUpdatePasswordURI, data={
                    'current_password': 'password',
                    'new_password': 'new password',
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))
