import util.cache
from test.backend.test_case import LinkrTestCase


class TestCache(LinkrTestCase):
    def test_format_key(self):
        self.assertEqual(util.cache.format_key('tag', 'key'), 'tag:key')
        self.assertEqual(util.cache.format_key('tag', None), 'tag:None')
        self.assertEqual(util.cache.format_key(None, 'key'), 'None:key')
