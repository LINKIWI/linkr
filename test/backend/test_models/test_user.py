import time

import mock

from models import User
from test.backend.test_case import LinkrTestCase


with mock.patch.object(time, 'time', return_value=5):
    user = User(
        username='username',
        password='password',
        signup_ip='127.0.0.1',
    )
    user.user_id = 1


class TestUser(LinkrTestCase):
    def test_init(self):
        self.assertEqual(user.signup_time, 5)
        self.assertEqual(user.signup_ip, '127.0.0.1')
        self.assertEqual(user.username, 'username')
        self.assertNotEqual(user.password_hash, 'password')
        self.assertIsNotNone(user.api_key)
        self.assertFalse(user.is_admin)

    def test_validate_password(self):
        self.assertTrue(user.validate_password('password'))
        self.assertFalse(user.validate_password('invalid'))

    def test_update_password(self):
        self.assertTrue(user.validate_password('password'))
        self.assertFalse(user.validate_password('new password'))
        user.update_password('new password')
        self.assertFalse(user.validate_password('password'))
        self.assertTrue(user.validate_password('new password'))
        user.update_password('password')

    def test_generate_new_api_key(self):
        old_api_key = user.api_key
        self.assertEqual(old_api_key, user.api_key)
        user.generate_new_api_key()
        self.assertNotEqual(old_api_key, user.api_key)

    def test_as_dict(self):
        self.assertEqual(user.as_dict(), {
            'user_id': 1,
            'is_admin': False,
            'signup_time': 5,
            'signup_ip': '127.0.0.1',
            'username': 'username',
            'api_key': user.api_key,
        })

    def test_is_authenticated(self):
        self.assertTrue(user.is_authenticated())

    def test_is_anonymous(self):
        self.assertFalse(user.is_anonymous())

    def test_get_id(self):
        self.assertEqual(user.get_id(), '1')

    def test_is_active(self):
        self.assertTrue(user.is_active)
