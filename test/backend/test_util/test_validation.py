from util.testing import LinkrTestCase

import util.validation


class TestValidation(LinkrTestCase):
    def test_is_username_valid(self):
        self.assertTrue(util.validation.is_username_valid('username'))
        self.assertTrue(util.validation.is_username_valid('username01'))
        self.assertTrue(util.validation.is_username_valid('Username01'))
        self.assertTrue(util.validation.is_username_valid('USERNAME'))
        self.assertTrue(util.validation.is_username_valid('USERNAME01'))

        self.assertFalse(util.validation.is_username_valid('%'))
        self.assertFalse(util.validation.is_username_valid('adsf**^sdf'))
        self.assertFalse(util.validation.is_username_valid('&&Ssdf'))
