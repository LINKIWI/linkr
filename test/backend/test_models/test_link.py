import linkr  # flake8: noqa: F401

import time

import mock

from models import Link
from test.backend.test_case import LinkrTestCase


with mock.patch.object(time, 'time', return_value=5):
    link = Link(
        alias='alias',
        outgoing_url='outgoing url',
    )
    link.link_id = 1


class TestLink(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_init(self):
        self.assertEqual(link.submit_time, 5)
        self.assertEqual(link.alias, 'alias')
        self.assertEqual(link.outgoing_url, 'outgoing url')
        self.assertEqual(link.password_hash, None)
        self.assertEqual(link.user_id, None)
        self.assertFalse(link.require_recaptcha)

    def test_validate_password(self):
        self.assertTrue(link.validate_password('password'))
        self.assertTrue(link.validate_password('anything'))
        self.assertTrue(link.validate_password(None))

    def test_update_password(self):
        self.assertTrue(link.validate_password('password'))
        link.update_password('new password')
        self.assertFalse(link.validate_password('password'))
        self.assertTrue(link.validate_password('new password'))
        link.update_password(None)

    def test_as_dict(self):
        link_dict = link.as_dict()
        del link_dict['full_alias']  # Value is dependent on config

        self.assertEqual(link_dict, {
            'link_id': 1,
            'user_id': None,
            'submit_time': 5,
            'alias': 'alias',
            'outgoing_url': 'outgoing url',
            'is_password_protected': False,
            'require_recaptcha': False,
        })

    def test_is_password_protected(self):
        self.assertFalse(link.is_password_protected())
