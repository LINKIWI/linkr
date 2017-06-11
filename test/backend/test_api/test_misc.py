import datetime

import git
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

    def test_api_version_valid(self):
        mock_repo = mock.MagicMock()
        mock_remote = mock.MagicMock()

        mock_remote.name = 'remote-name'
        mock_remote.urls = ['remote-url']

        mock_repo.active_branch.name = 'master'
        mock_repo.active_branch.commit.hexsha = 'sha'
        mock_repo.active_branch.commit.message = 'message'
        mock_repo.active_branch.commit.authored_datetime = datetime.datetime(
            year=2017,
            month=6,
            day=11,
            hour=11,
            minute=0,
        )
        mock_repo.remote = lambda: mock_remote

        with mock.patch.object(git, 'Repo') as mock_get_repo:
            mock_get_repo.return_value = mock_repo

            resp = self.api_utils.request(VersionURI)

            self.assertEqual(resp.json['version'], {
                'branch': 'master',
                'sha': 'sha',
                'message': 'message',
                'date': '2017-06-11T11:00:00',
                'remote': {
                    'remote-name': ['remote-url'],
                },
            })

    def test_api_version_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(VersionURI)

                self.assertTrue(self.api_utils.is_undefined_error(resp))
