import mock

import util.recaptcha
import util.response
from test.backend.test_case import LinkrTestCase
from uri.misc import *


class TestMisc(LinkrTestCase):
    def test_api_config_valid(self):
        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(ConfigURI)
            options = resp.json['config']['options']
            secrets = resp.json['config']['secrets']

            self.assertEqual(resp.status_code, 200)

            for _, value in options.items():
                self.assertEqual(value, 'value')
            for _, value in secrets.items():
                self.assertEqual(value, 'value')

    def test_api_config_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(ConfigURI)

                self.assertTrue(self.api_utils.is_undefined_error(resp))
