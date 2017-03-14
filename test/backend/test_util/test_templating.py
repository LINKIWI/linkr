import util.templating
from test.backend.test_case import LinkrTestCase
from uri.link import LinkAddURI


class TestTemplating(LinkrTestCase):
    def test_get_config(self):
        self.assertIsNotNone(util.templating.get_config()['config'])

    def test_get_uri_path(self):
        uri = util.templating.get_uri_path()['uri']
        full_uri = util.templating.get_uri_path()['full_uri']

        self.assertEqual(uri('link', 'LinkAddURI'), LinkAddURI.uri())
        self.assertEqual(full_uri('link', 'LinkAddURI'), LinkAddURI.full_uri())

    def test_get_all_uris(self):
        uri = util.templating.get_uri_path()['uri']
        all_uris = util.templating.get_all_uris()['all_uris']()
        self.assertGreater(len(all_uris), 0)

        for uri_module in all_uris:
            for uri_class in all_uris[uri_module]:
                self.assertIsNotNone(uri(uri_module, uri_class))
