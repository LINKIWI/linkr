from util.testing import LinkrTestCase

import database.link


class TestLink(LinkrTestCase):
    def test_add_link_invalid_alias(self):
        pass

    def test_add_link_invalid_url(self):
        pass

    def test_add_link_valid(self):
        added = database.link.add_link('alias', 'https://google.com')
        self.assertEqual(added.alias, 'alias')
        self.assertEqual(added.outgoing_url, 'https://google.com')

    def test_delete_link_nonexistent(self):
        pass

    def test_delete_link_valid(self):
        pass
