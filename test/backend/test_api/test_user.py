import linkr  # flake8: noqa: F401

import mock

import util.recaptcha
import util.response
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from test.backend.test_case import mock_config_options
from uri.auth import *
from uri.user import *


class TestUser(LinkrTestCase):
    _multiprocess_can_split_ = True

    @mock_config_options(server={'allow_open_registration': False})
    def test_api_add_new_user_registration_disabled(self):
        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json['failure'], 'failure_open_registration_disabled')

    @mock_config_options(server={'allow_open_registration': True})
    def test_api_add_new_user_unauth_new_admin(self):
        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
            'is_admin': True,
        })

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json['failure'], 'failure_unauth')

    @mock_config_options(server={'allow_open_registration': True})
    def test_api_add_new_user_non_admin_new_admin(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserAddURI, data={
                'username': 'username',
                'password': 'password',
                'is_admin': True,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    @mock_config_options(server={'allow_open_registration': True})
    def test_api_add_new_user_unavailable_username(self):
        UserFactory.generate(username='username')

        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 409)
        self.assertEqual(resp.json['failure'], 'failure_unavailable_username')

    @mock_config_options(server={'allow_open_registration': True})
    def test_api_add_new_user_invalid_username(self):
        resp = self.api_utils.request(UserAddURI, data={
            'username': 'username with spaces',
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json['failure'], 'failure_invalid_username')

    @mock_config_options(server={'allow_open_registration': True})
    def test_api_add_new_user_valid(self):
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

    def test_api_regenerate_user_api_key_invalid_auth(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserRegenerateAPIKeyURI, data={
                'password': 'invalid',
            })

            self.assertEqual(resp.status_code, 401)
            self.assertEqual(resp.json['failure'], 'failure_invalid_auth')

    def test_api_regenerate_user_api_key_valid(self):
        with self.api_utils.authenticated_user() as user:
            old_api_key = user.api_key

            resp = self.api_utils.request(UserRegenerateAPIKeyURI, data={
                'password': 'password',
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['user_id'], user.user_id)
            self.assertNotEqual(old_api_key, user.api_key)

    def test_api_regenerate_user_api_key_undefined_error(self):
        with self.api_utils.authenticated_user():
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(UserRegenerateAPIKeyURI, data={
                    'password': 'password',
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_recent_users_unauth(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(RecentUsersURI, data={
                'page_num': 0,
                'num_per_page': 10,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_recent_users_valid(self):
        with self.api_utils.authenticated_user(is_admin=True) as admin:
            resp = self.api_utils.request(RecentUsersURI, data={
                'page_num': 0,
                'num_per_page': 10,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['users'], [admin.as_dict()])

    def test_api_recent_users_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(RecentUsersURI, data={
                    'page_num': 0,
                    'num_per_page': 10,
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_user_search_unauth(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(UserSearchURI, data={
                'username': 'username',
                'page_num': 0,
                'num_per_page': 10,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_user_search_valid(self):
        with self.api_utils.authenticated_user(is_admin=True) as admin:
            resp = self.api_utils.request(UserSearchURI, data={
                'username': admin.username,
                'page_num': 0,
                'num_per_page': 10,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['users'], [admin.as_dict()])

    def test_api_user_search_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True) as admin:
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(UserSearchURI, data={
                    'username': admin.username,
                    'page_num': 0,
                    'num_per_page': 10,
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))
