import linkr  # flake8: noqa: F401

import mock
import webpreview

import util.recaptcha
import util.response
from test.backend.factory import LinkFactory
from test.backend.factory import UserFactory
from test.backend.test_case import LinkrTestCase
from uri.link import *


class TestLink(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_api_link_details_nonexistent(self):
        resp = self.api_utils.request(LinkDetailsURI)

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_link_details_empty_password(self):
        link = LinkFactory.generate(password='password')
        resp = self.api_utils.request(LinkDetailsURI, data={'link_id': link.link_id})

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_incorrect_link_password')

    def test_api_link_details_wrong_password(self):
        link = LinkFactory.generate(password='password')
        resp = self.api_utils.request(LinkDetailsURI, data={
            'link_id': link.link_id,
            'password': 'invalid',
        })

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_incorrect_link_password')

    def test_api_link_details_wrong_recaptcha(self):
        with mock.patch.object(util.recaptcha, 'validate_recaptcha') as mock_validate_recaptcha:
            mock_validate_recaptcha.return_value = False
            link = LinkFactory.generate(require_recaptcha=True)
            resp = self.api_utils.request(LinkDetailsURI, data={'link_id': link.link_id})

            self.assertEqual(resp.status_code, 401)
            self.assertEqual(resp.json['failure'], 'failure_invalid_recaptcha')

    def test_api_link_details_lookup_by_id(self):
        link = LinkFactory.generate()
        resp = self.api_utils.request(LinkDetailsURI, data={'link_id': link.link_id})

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json['details'], link.as_dict())

    def test_api_link_details_lookup_by_alias(self):
        link = LinkFactory.generate()
        resp = self.api_utils.request(LinkDetailsURI, data={'alias': link.alias})

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json['details'], link.as_dict())

    def test_api_link_details_correct_password(self):
        with mock.patch.object(util.recaptcha, 'validate_recaptcha') as mock_validate_recaptcha:
            link = LinkFactory.generate(password='password')
            resp = self.api_utils.request(LinkDetailsURI, data={
                'link_id': link.link_id,
                'password': 'password',
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['details'], link.as_dict())
            self.assertFalse(mock_validate_recaptcha.called)

    def test_api_link_details_correct_recaptcha(self):
        with mock.patch.object(util.recaptcha, 'validate_recaptcha') as mock_validate_recaptcha:
            mock_validate_recaptcha.return_value = True
            link = LinkFactory.generate(require_recaptcha=True)
            resp = self.api_utils.request(LinkDetailsURI, data={'link_id': link.link_id})

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['details'], link.as_dict())
            self.assertTrue(mock_validate_recaptcha.called)

    def test_api_link_details_undefined_error(self):
        link = LinkFactory.generate()

        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(LinkDetailsURI, data={'link_id': link.link_id})
            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_increment_link_hits_nonexistent(self):
        resp = self.api_utils.request(LinkIncrementHitsURI, data={'link_id': 1})

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_increment_link_hits_empty_password(self):
        link = LinkFactory.generate(password='password')
        resp = self.api_utils.request(LinkIncrementHitsURI, data={'link_id': link.link_id})

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_incorrect_link_password')

    def test_api_increment_link_hits_wrong_password(self):
        link = LinkFactory.generate(password='password')
        resp = self.api_utils.request(LinkIncrementHitsURI, data={
            'link_id': link.link_id,
            'password': 'invalid',
        })

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json['failure'], 'failure_incorrect_link_password')

    def test_api_increment_link_hits_correct_password(self):
        link = LinkFactory.generate(password='password')
        resp = self.api_utils.request(LinkIncrementHitsURI, data={
            'link_id': link.link_id,
            'password': 'password',
        })

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp.json['hit'])

    def test_api_increment_link_hits_undefined_error(self):
        link = LinkFactory.generate()

        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(LinkIncrementHitsURI, data={'link_id': link.link_id})
            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_add_link_invalid_alias(self):
        resp = self.api_utils.request(LinkAddURI, data={
            'alias': '/',
            'outgoing_url': 'https://google.com',
        })

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json['failure'], 'failure_invalid_alias')

    def test_api_add_link_reserved_alias(self):
        resp = self.api_utils.request(LinkAddURI, data={
            'alias': 'linkr',
            'outgoing_url': 'https://google.com',
        })

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json['failure'], 'failure_reserved_alias')

    def test_api_add_link_invalid_url(self):
        resp = self.api_utils.request(LinkAddURI, data={
            'alias': 'alias',
            'outgoing_url': 'invalid',
        })

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json['failure'], 'failure_invalid_url')

    def test_api_add_link_unavailable_alias(self):
        link = LinkFactory.generate()
        resp = self.api_utils.request(LinkAddURI, data={
            'alias': link.alias,
            'outgoing_url': 'https://google.com',
        })

        self.assertEqual(resp.status_code, 409)
        self.assertEqual(resp.json['failure'], 'failure_unavailable_alias')

    def test_api_add_link_undefined_error(self):
        with mock.patch.object(util.response, 'success') as mock_success:
            mock_success.side_effect = ValueError

            resp = self.api_utils.request(LinkAddURI, data={
                'alias': 'alias',
                'outgoing_url': 'https://google.com',
            })

            self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_add_link_valid(self):
        resp = self.api_utils.request(LinkAddURI, data={
            'alias': 'alias',
            'outgoing_url': 'https://google.com',
        })

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json['alias'], 'alias')
        self.assertEqual(resp.json['outgoing_url'], 'https://google.com')

    def test_api_edit_link_nonexistent(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': -1,
                'alias': 'alias',
                'outgoing_url': 'https://google.com',
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_edit_link_unauthorized(self):
        link = LinkFactory.generate(user_id=5)

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': link.link_id,
                'alias': 'alias',
                'outgoing_url': 'https://google.com',
            })

            self.assertEqual(resp.status_code, 403)

    def test_api_edit_link_invalid_alias(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': link.link_id,
                'alias': 'invalid alias',
                'outgoing_url': 'https://google.com',
            })

            self.assertEqual(resp.status_code, 400)
            self.assertEqual(resp.json['failure'], 'failure_invalid_alias')

    def test_api_edit_link_reserved_alias(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': link.link_id,
                'alias': 'linkr',
                'outgoing_url': 'https://google.com',
            })

            self.assertEqual(resp.status_code, 400)
            self.assertEqual(resp.json['failure'], 'failure_reserved_alias')

    def test_api_edit_link_invalid_url(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': link.link_id,
                'alias': 'alias',
                'outgoing_url': 'not a url',
            })

            self.assertEqual(resp.status_code, 400)
            self.assertEqual(resp.json['failure'], 'failure_invalid_url')

    def test_api_edit_link_valid(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkEditURI, data={
                'link_id': link.link_id,
                'alias': 'alias',
                'outgoing_url': 'https://google.com',
            })

            self.assertEqual(resp.status_code, 200)

    def test_api_edit_link_undefined_error(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinkEditURI, data={
                    'link_id': link.link_id,
                    'alias': 'alias',
                    'outgoing_url': 'https://google.com',
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_update_link_password_nonexistent(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkUpdatePasswordURI, data={
                'link_id': -1,
                'password': 'password',
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_update_link_password_unauthorized(self):
        link = LinkFactory.generate()

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkUpdatePasswordURI, data={
                'link_id': link.link_id,
                'password': 'password',
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_update_link_password_valid(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkUpdatePasswordURI, data={
                'link_id': link.link_id,
                'password': 'updated password',
            })

            self.assertEqual(resp.status_code, 200)

            resp = self.api_utils.request(LinkDetailsURI, data={
                'link_id': link.link_id,
                'password': 'updated password',
            })

            self.assertEqual(resp.status_code, 200)

    def test_api_update_link_password_undefined_error(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinkUpdatePasswordURI, data={
                    'link_id': link.link_id,
                    'password': 'password',
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_delete_link_nonexistent(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkDeleteURI, data={
                'link_id': -1,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_delete_link_unauthorized(self):
        link = LinkFactory.generate()

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkDeleteURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_delete_link_valid(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinkDeleteURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 200)

            resp = self.api_utils.request(LinkDeleteURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_delete_link_undefined_error(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinkDeleteURI, data={
                    'link_id': link.link_id,
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_link_hits_nonexistent(self):
        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(LinkHitsURI, data={
                'link_id': -1,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_link_hits_valid(self):
        link = LinkFactory.generate()

        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(LinkHitsURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['hits'], [])

            resp = self.api_utils.request(LinkIncrementHitsURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 200)

            resp = self.api_utils.request(LinkHitsURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(len(resp.json['hits']), 1)

    def test_api_link_hits_undefined_error(self):
        link = LinkFactory.generate()

        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinkHitsURI, data={
                    'link_id': link.link_id,
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_links_for_user_unauth(self):
        LinkFactory.generate(user_id=5)

        # Trying to view links created by someone else as non-admin
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinksForUserURI, data={
                'user_id': 5,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_links_for_user_nonexistent_user(self):
        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(LinksForUserURI, data={
                'user_id': 5,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_user')

    def test_api_links_for_user_current_user_valid(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinksForUserURI)

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['links'], [link.as_dict()])

    def test_api_links_for_user_specified_user_valid(self):
        user = UserFactory.generate()

        with self.api_utils.authenticated_user(is_admin=True):
            link = LinkFactory.generate(user_id=user.user_id)

            resp = self.api_utils.request(LinksForUserURI, data={
                'user_id': user.user_id,
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['links'], [link.as_dict()])

    def test_api_links_for_user_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinksForUserURI)

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_recent_links_valid(self):
        links = sorted(
            [LinkFactory.generate() for _ in xrange(5)],
            key=lambda generated: generated.link_id,
            reverse=True,
        )

        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(RecentLinksURI)

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['links'], [link.as_dict() for link in links])

    def test_api_recent_links_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(RecentLinksURI)

                self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_link_preview_nonexistent(self):
        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkPreviewURI, data={
                'link_id': 1,
            })

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['failure'], 'failure_nonexistent_link')

    def test_api_link_preview_unauth(self):
        link = LinkFactory.generate(user_id=5)

        with self.api_utils.authenticated_user():
            resp = self.api_utils.request(LinkPreviewURI, data={
                'link_id': link.link_id,
            })

            self.assertEqual(resp.status_code, 403)
            self.assertEqual(resp.json['failure'], 'failure_unauth')

    def test_api_link_preview_valid(self):
        with self.api_utils.authenticated_user() as user:
            with mock.patch.object(webpreview, 'web_preview') as mock_web_preview:
                mock_web_preview.return_value = 'title', 'description', 'image'
                link = LinkFactory.generate(user_id=user.user_id)

                resp = self.api_utils.request(LinkPreviewURI, data={
                    'link_id': link.link_id,
                })

                self.assertTrue(mock_web_preview.called)
                self.assertEqual(resp.status_code, 200)
                self.assertEqual(
                    resp.json['preview'],
                    {
                        'title': 'title',
                        'description': 'description',
                        'image': 'image',
                    },
                )

    def test_api_link_preview_undefined_error(self):
        with self.api_utils.authenticated_user() as user:
            link = LinkFactory.generate(user_id=user.user_id)

            with mock.patch.object(webpreview, 'web_preview') as mock_web_preview:
                mock_web_preview.return_value = 'title', 'description', 'image'

                with mock.patch.object(util.response, 'success') as mock_success:
                    mock_success.side_effect = ValueError

                    resp = self.api_utils.request(LinkPreviewURI, data={
                        'link_id': link.link_id,
                    })

                    self.assertTrue(self.api_utils.is_undefined_error(resp))

    def test_api_link_alias_search_valid(self):
        match_links = [LinkFactory.generate(alias='ab'), LinkFactory.generate(alias='abcd')]
        LinkFactory.generate(alias='efgh')

        with self.api_utils.authenticated_user(is_admin=True):
            resp = self.api_utils.request(LinkAliasSearchURI, data={
                'alias': 'ab',
            })

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['links'], [link.as_dict() for link in match_links])

    def test_api_link_alias_search_undefined_error(self):
        with self.api_utils.authenticated_user(is_admin=True):
            with mock.patch.object(util.response, 'success') as mock_success:
                mock_success.side_effect = ValueError

                resp = self.api_utils.request(LinkAliasSearchURI, data={
                    'alias': 'ab',
                })

                self.assertTrue(self.api_utils.is_undefined_error(resp))
