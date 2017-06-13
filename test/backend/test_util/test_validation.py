import linkr  # flake8: noqa: F401

import util.validation
from test.backend.test_case import LinkrTestCase


class TestValidation(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_is_alias_valid(self):
        self.assertTrue(util.validation.is_alias_valid('alias'))
        self.assertTrue(util.validation.is_alias_valid('alias-alias'))
        self.assertTrue(util.validation.is_alias_valid('alias_alias'))
        self.assertTrue(util.validation.is_alias_valid('alias_alias01'))

        self.assertFalse(util.validation.is_alias_valid('alias with spaces'))
        self.assertFalse(util.validation.is_alias_valid('alias/with/unsafe/slashes'))
        self.assertFalse(util.validation.is_alias_valid(''))
        self.assertFalse(util.validation.is_alias_valid('a' * 33))

    def test_is_alias_reserved(self):
        self.assertTrue(util.validation.is_alias_reserved('linkr'))
        self.assertTrue(util.validation.is_alias_reserved('LINkr'))

        self.assertFalse(util.validation.is_alias_reserved('alias'))

    def test_is_url_valid(self):
        self.assertTrue(util.validation.is_url_valid('http://google.com'))
        self.assertTrue(util.validation.is_url_valid('https://google.com'))
        self.assertTrue(util.validation.is_url_valid('https://google.com:443'))
        self.assertTrue(util.validation.is_url_valid('http://localhost'))
        self.assertTrue(util.validation.is_url_valid('http://localhost:5000'))

        self.assertFalse(util.validation.is_url_valid('google.com'))
        self.assertFalse(util.validation.is_url_valid('has spaces'))
        self.assertFalse(util.validation.is_url_valid('what'))

    def test_is_username_valid(self):
        self.assertTrue(util.validation.is_username_valid('username'))
        self.assertTrue(util.validation.is_username_valid('username01'))
        self.assertTrue(util.validation.is_username_valid('user-name'))
        self.assertTrue(util.validation.is_username_valid('user_name'))
        self.assertTrue(util.validation.is_username_valid('user_name1'))
        self.assertTrue(util.validation.is_username_valid('Username01'))
        self.assertTrue(util.validation.is_username_valid('USERNAME'))
        self.assertTrue(util.validation.is_username_valid('USERNAME01'))

        self.assertFalse(util.validation.is_username_valid(''))
        self.assertFalse(util.validation.is_username_valid('%'))
        self.assertFalse(util.validation.is_username_valid('adsf**^sdf'))
        self.assertFalse(util.validation.is_username_valid('&&Ssdf'))
