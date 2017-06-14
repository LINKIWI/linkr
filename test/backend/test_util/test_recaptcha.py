import linkr  # flake8: noqa: F401

import json
import mock
import requests

import util.recaptcha
from test.backend.test_case import LinkrTestCase


class TestRecaptcha(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_validate_recaptcha_error(self):
        mock_resp = mock.MagicMock()
        mock_resp.text = json.dumps({'success': False})
        with mock.patch.object(requests, 'post', return_value=mock_resp) as mock_requests:
            success = util.recaptcha.validate_recaptcha('response', 'ip')

            self.assertFalse(success)
            mock_requests.assert_called_once_with(
                url='https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': mock.ANY,
                    'response': 'response',
                    'remoteip': 'ip',
                },
            )

    def test_validate_recaptcha_success(self):
        mock_resp = mock.MagicMock()
        mock_resp.text = json.dumps({'success': True})
        with mock.patch.object(requests, 'post', return_value=mock_resp) as mock_requests:
            success = util.recaptcha.validate_recaptcha('response', 'ip')

            self.assertTrue(success)
            mock_requests.assert_called_once_with(
                url='https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': mock.ANY,
                    'response': 'response',
                    'remoteip': 'ip',
                },
            )
