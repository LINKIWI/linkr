import database.link
import util.cryptography
from util.exception import *
from util.testing import LinkrTestCase
from util.testing import LinkFactory
from util.testing import LinkHitFactory


class TestLink(LinkrTestCase):
    def test_add_link_invalid_alias(self):
        self.assertRaises(
            InvalidAliasException,
            database.link.add_link,
            alias='',
            outgoing_url='',
        )
        self.assertRaises(
            InvalidAliasException,
            database.link.add_link,
            alias='cannot contain spaces',
            outgoing_url='',
        )
        self.assertRaises(
            InvalidAliasException,
            database.link.add_link,
            alias='cannot/contain/slashes',
            outgoing_url='',
        )
        self.assertRaises(
            InvalidAliasException,
            database.link.add_link,
            alias='cannot?contain&characters*like&these',
            outgoing_url='',
        )
        self.assertRaises(
            InvalidAliasException,
            database.link.add_link,
            alias='toolong' * 33,
            outgoing_url='',
        )

    def test_add_link_invalid_url(self):
        self.assertRaises(
            InvalidURLException,
            database.link.add_link,
            alias='valid',
            outgoing_url='invalid',
        )
        self.assertRaises(
            InvalidURLException,
            database.link.add_link,
            alias='valid',
            outgoing_url='://invalid-schema',
        )
        self.assertRaises(
            InvalidURLException,
            database.link.add_link,
            alias='valid',
            outgoing_url='more spaces',
        )

    def test_add_link_unavailable_alias(self):
        database.link.add_link('alias', 'https://google.com')

        self.assertRaises(
            UnavailableAliasException,
            database.link.add_link,
            alias='alias',
            outgoing_url='https://google.com',
        )

    def test_add_link_valid_alias_outgoing_url(self):
        valid_inputs = [
            ('alias', 'https://google.com'),
            ('alias-with-dashes', 'https://google.com'),
            ('alias.with.dots', 'https://google.com'),
            ('alias2', 'http://localhost'),
            ('alias3', 'http://localhost:5000'),
        ]

        for alias, outgoing_url in valid_inputs:
            added = database.link.add_link(alias, outgoing_url)
            self.assertEqual(added.alias, alias)
            self.assertEqual(added.outgoing_url, outgoing_url)
            self.assertIsNotNone(added.link_id)
            self.assertIsNone(added.password_hash)

    def test_add_link_valid_additional_properties(self):
        added = database.link.add_link(
            alias='alias',
            outgoing_url='https://google.com',
            password='password',
            user_id=1.
        )

        self.assertEqual(added.alias, 'alias')
        self.assertEqual(added.outgoing_url, 'https://google.com')
        self.assertEqual(added.password_hash, util.cryptography.secure_hash('password'))
        self.assertEqual(added.user_id, 1)

    def test_edit_link_nonexistent(self):
        self.assertRaises(
            NonexistentLinkException,
            database.link.edit_link,
            link_id=1,
        )

    def test_edit_link_invalid_alias(self):
        added = database.link.add_link('alias', 'https://google.com')

        self.assertRaises(
            InvalidAliasException,
            database.link.edit_link,
            link_id=added.link_id,
            alias='invalid alias'
        )

    def test_edit_link_invalid_url(self):
        added = database.link.add_link('alias', 'https://google.com')

        self.assertRaises(
            InvalidURLException,
            database.link.edit_link,
            link_id=added.link_id,
            alias='alias',
            outgoing_url='invalid',
        )

    def test_edit_link_valid(self):
        added = database.link.add_link('alias', 'https://google.com')
        database.link.edit_link(
            link_id=added.link_id,
            alias='new-alias',
            outgoing_url='https://localhost',
        )
        updated = database.link.get_link_by_id(added.link_id)

        self.assertEqual(updated.alias, 'new-alias')
        self.assertEqual(updated.outgoing_url, 'https://localhost')

        database.link.edit_link(
            link_id=added.link_id,
            alias='new-new-alias',
        )
        updated = database.link.get_link_by_id(added.link_id)

        self.assertEqual(updated.alias, 'new-new-alias')
        self.assertEqual(updated.outgoing_url, 'https://localhost')

    def test_update_link_password_nonexistent(self):
        self.assertRaises(
            NonexistentLinkException,
            database.link.update_link_password,
            link_id=1,
            password='password',
        )

    def test_update_link_password_remove(self):
        added = database.link.add_link('alias', 'https://google.com', password='password')

        self.assertIsNotNone(added.password_hash)
        self.assertTrue(added.is_password_protected())

        database.link.update_link_password(link_id=added.link_id, password=None)
        updated = database.link.get_link_by_id(link_id=added.link_id)

        self.assertIsNone(updated.password_hash)
        self.assertFalse(updated.is_password_protected())

    def test_update_link_password_modify(self):
        added = database.link.add_link('alias', 'https://google.com', password='password')

        self.assertIsNotNone(added.password_hash)
        self.assertTrue(added.is_password_protected())
        self.assertTrue(added.validate_password('password'))
        self.assertFalse(added.validate_password('new-password'))

        database.link.update_link_password(link_id=added.link_id, password='new-password')
        updated = database.link.get_link_by_id(link_id=added.link_id)

        self.assertIsNotNone(updated.password_hash)
        self.assertTrue(updated.is_password_protected())
        self.assertFalse(updated.validate_password('password'))
        self.assertTrue(updated.validate_password('new-password'))

    def test_delete_link_nonexistent(self):
        self.assertRaises(
            NonexistentLinkException,
            database.link.delete_link,
            link_id=1,
        )

    def test_delete_link_valid(self):
        added = database.link.add_link('alias', 'https://google.com', password='password')
        database.link.delete_link(added.link_id)

        self.assertIsNone(database.link.get_link_by_id(added.link_id))

    def test_add_link_hit(self):
        link_hit = database.link.add_link_hit(
            link_id=1,
            remote_ip='127.0.0.1',
            referer='referer',
            user_agent='user-agent',
        )

        self.assertIsNotNone(link_hit.hit_id)
        self.assertEqual(link_hit.link_id, 1)
        self.assertEqual(link_hit.remote_ip, '127.0.0.1')
        self.assertEqual(link_hit.referer, 'referer')
        self.assertEqual(link_hit.user_agent, 'user-agent')

    def test_get_link_hits_by_id(self):
        link = LinkFactory.generate()
        hits = [LinkHitFactory.generate(link_id=link.link_id) for _ in xrange(10)]
        [LinkHitFactory.generate(link_id=-1) for _ in xrange(10)]
        queried_hits = database.link.get_link_hits_by_id(link_id=link.link_id)

        self.assertEqual(queried_hits, list(reversed(hits)))

    def test_get_link_hits_by_id_pagination(self):
        link = LinkFactory.generate()
        hits = [LinkHitFactory.generate(link_id=link.link_id) for _ in xrange(10)]

        queried_hits = database.link.get_link_hits_by_id(
            link_id=link.link_id,
            page_num=0,
            num_per_page=5,
        )
        self.assertEqual(queried_hits, list(reversed(hits))[:5])

        queried_hits = database.link.get_link_hits_by_id(
            link_id=link.link_id,
            page_num=1,
            num_per_page=5,
        )
        self.assertEqual(queried_hits, list(reversed(hits))[5:])

    def test_get_link_by_id(self):
        link = LinkFactory.generate()
        queried_link = database.link.get_link_by_id(link.link_id)

        self.assertEqual(queried_link, link)

    def test_get_link_by_alias(self):
        link = LinkFactory.generate(alias='alias')
        queried_link = database.link.get_link_by_alias('alias')

        self.assertEqual(queried_link, link)

    def test_get_links_for_user(self):
        links = [
            LinkFactory.generate(user_id=1)
            for _ in xrange(10)
        ]

        self.assertEqual(database.link.get_links_for_user(0), [])
        self.assertEqual(database.link.get_links_for_user(1), links)

    def test_get_recent_links(self):
        links = [
            LinkFactory.generate()
            for _ in xrange(10)
        ]
        queried_links = database.link.get_recent_links()

        self.assertEqual(queried_links, list(reversed(links)))

    def test_get_recent_links_pagination(self):
        links = [
            LinkFactory.generate()
            for _ in xrange(10)
        ]

        queried_links = database.link.get_recent_links(page_num=0, num_per_page=5)
        self.assertEqual(queried_links, list(reversed(links))[:5])

        queried_links = database.link.get_recent_links(page_num=1, num_per_page=5)
        self.assertEqual(queried_links, list(reversed(links))[5:])
