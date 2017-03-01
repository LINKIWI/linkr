import database.link
import database.user
from test.backend.factory import LinkFactory
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from util.exception import *


class TestUser(LinkrTestCase):
    def test_add_user_unavailable_username(self):
        UserFactory.generate(username='username')

        self.assertRaises(
            UnavailableUsernameException,
            database.user.add_user,
            username='username',
            password='password',
            signup_ip='127.0.0.1',
        )

    def test_add_user_invalid_username(self):
        self.assertRaises(
            InvalidUsernameException,
            database.user.add_user,
            username='username with spaces',
            password='password',
            signup_ip='127.0.0.1',
        )

    def test_add_user_valid(self):
        user = database.user.add_user(
            username='username',
            password='password',
            signup_ip='127.0.0.1',
        )

        self.assertEqual(user.username, 'username')
        self.assertNotEqual(user.password_hash, 'password')
        self.assertEqual(user.signup_ip, '127.0.0.1')
        self.assertFalse(user.is_admin)

    def test_delete_user_nonexistent(self):
        self.assertRaises(
            NonexistentUserException,
            database.user.delete_user,
            user_id=1,
        )

    def test_delete_user_valid(self):
        user = UserFactory.generate()
        links = [LinkFactory.generate(user_id=user.user_id) for _ in xrange(5)]

        database.user.delete_user(user.user_id)

        self.assertRaises(
            NonexistentUserException,
            database.user.delete_user,
            user_id=user.user_id,
        )

        for link in links:
            self.assertIsNone(database.link.get_link_by_id(link.link_id))

    def test_generate_new_api_key_nonexistent(self):
        self.assertRaises(
            NonexistentUserException,
            database.user.generate_new_api_key,
            user_id=1,
        )

    def test_generate_new_api_key_valid(self):
        user = UserFactory.generate()
        old_api_key = user.api_key
        database.user.generate_new_api_key(user.user_id)
        new_api_key = database.user.get_user_by_id(user.user_id).api_key

        self.assertNotEqual(old_api_key, new_api_key)

    def test_update_user_password_nonexistent(self):
        self.assertRaises(
            NonexistentUserException,
            database.user.update_user_password,
            user_id=1,
            new_password='',
        )

    def test_update_user_password_valid(self):
        user = UserFactory.generate()
        old_password_hash = user.password_hash
        database.user.update_user_password(user.user_id, 'new password')
        updated_password_hash = database.user.get_user_by_id(user.user_id).password_hash

        self.assertNotEqual(old_password_hash, updated_password_hash)

    def test_validate_user_credentials_nonexistent_username(self):
        self.assertRaises(
            NonexistentUserException,
            database.user.validate_user_credentials,
            username='username',
            password='',
        )

    def test_validate_user_credentials_invalid_authentication(self):
        user = UserFactory.generate(password='password')

        self.assertRaises(
            InvalidAuthenticationException,
            database.user.validate_user_credentials,
            username=user.username,
            password='invalid',
        )

    def test_validate_user_credentials_valid(self):
        user = UserFactory.generate(password='password')

        validated_user = database.user.validate_user_credentials(
            username=user.username,
            password='password',
        )
        self.assertIsNotNone(validated_user)

    def test_get_user_by_id_nonexistent(self):
        self.assertIsNone(database.user.get_user_by_id(1))

    def test_get_user_by_id(self):
        user = UserFactory.generate()

        self.assertEqual(database.user.get_user_by_id(user.user_id), user)

    def test_get_user_by_api_key_nonexistent(self):
        self.assertIsNone(database.user.get_user_by_api_key(1))

    def test_get_user_by_api_key(self):
        user = UserFactory.generate()

        self.assertEqual(database.user.get_user_by_api_key(user.api_key), user)

    def test_get_users_like_username(self):
        users = [
            UserFactory.generate(username='1'),
            UserFactory.generate(username='12'),
            UserFactory.generate(username='123'),
        ]

        self.assertEqual(database.user.get_users_like_username('1'), users)
        self.assertEqual(database.user.get_users_like_username('12'), users[1:])
        self.assertEqual(database.user.get_users_like_username('123'), users[2:])
        self.assertEqual(database.user.get_users_like_username('4'), [])

    def test_get_recent_users(self):
        users = [UserFactory.generate() for _ in xrange(5)]

        self.assertEqual(database.user.get_recent_users(), users[::-1])
