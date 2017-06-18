import linkr  # flake8: noqa: F401

from test.backend.test_case import LinkrTestCase
from test.backend.test_case import mock_config_options
from uri.base_uri import URI


class TestURI(URI):
    fqdn = 'domain.com'
    path = '/test-uri-path'


class TestSecureAPIURI(URI):
    is_public = False
    path = '/linkr/api/path'


class TestEmbeddedParamsURI(URI):
    fqdn = 'domain.com'
    path = '/test/<embed>/uri'


class TestBaseURI(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_uri(self):
        self.assertEqual('/test-uri-path', TestURI.uri())
        self.assertEqual('/test-uri-path?key1=value1', TestURI.uri(key1='value1'))
        self.assertEqual(
            '/test-uri-path?key2=value2&key1=value1',
            TestURI.uri(key1='value1', key2='value2'),
        )

        self.assertEqual('/test/key/uri', TestEmbeddedParamsURI.uri(embed='key'))
        self.assertEqual(
            '/test/key/uri?extra=param',
            TestEmbeddedParamsURI.uri(embed='key', extra='param'),
        )

    def test_full_uri(self):
        self.assertEqual('domain.com/test-uri-path', TestURI.full_uri())
        self.assertEqual('domain.com/test-uri-path', TestURI.full_uri(https=True))
        self.assertEqual('domain.com/test-uri-path?key1=value1', TestURI.full_uri(key1='value1'))
        self.assertEqual(
            'domain.com/test-uri-path?key1=value1',
            TestURI.full_uri(key1='value1', https=True),
        )
        self.assertEqual(
            'domain.com/test-uri-path?key2=value2&key1=value1',
            TestURI.full_uri(key1='value1', key2='value2'),
        )
        self.assertEqual('domain.com/test/key/uri', TestEmbeddedParamsURI.full_uri(embed='key'))
        self.assertEqual(
            'domain.com/test/key/uri?extra=param',
            TestEmbeddedParamsURI.full_uri(embed='key', extra='param'),
        )

        self.assertEqual('domain.com/test-uri-path', TestURI.full_uri())
        self.assertEqual('domain.com/test-uri-path?key1=value1', TestURI.full_uri(key1='value1'))
        self.assertEqual(
            'domain.com/test-uri-path?key2=value2&key1=value1',
            TestURI.full_uri(key1='value1', key2='value2'),
        )

    def test_get_path(self):
        self.assertEqual('/test-uri-path', TestURI.get_path())

    @mock_config_options(server={'secure_frontend_requests': True})
    def test_get_path_secure(self):
        path = TestSecureAPIURI.get_path()
        self.assertTrue(path.startswith('/linkr/api/'))
        self.assertNotEqual(path, TestSecureAPIURI.path)

    def test_view_uri(self):
        self.assertEqual(URI.view_uri('/path'), '/linkr/path')

    def test_api_uri(self):
        self.assertEqual(URI.api_uri('/path'), '/linkr/api/path')
