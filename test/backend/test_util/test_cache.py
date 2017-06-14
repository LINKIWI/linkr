import linkr  # flake8: noqa: F401

import util.cache
from test.backend.test_case import LinkrTestCase


class TestCache(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_format_key(self):
        self.assertEqual(util.cache.format_key('tag', 'key'), 'tag:key')
        self.assertEqual(util.cache.format_key('tag', None), 'tag:None')
        self.assertEqual(util.cache.format_key(None, 'key'), 'None:key')
