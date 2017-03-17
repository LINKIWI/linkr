import time

import mock

from models import LinkHit
from test.backend.test_case import LinkrTestCase


class TestLinkHit(LinkrTestCase):
    def test_init(self):
        with mock.patch.object(time, 'time', return_value=5):
            link_hit = LinkHit(
                link_id=1,
                remote_ip='127.0.0.1',
                referer='referer',
                user_agent='user agent',
            )

        self.assertEqual(link_hit.timestamp, 5)
        self.assertEqual(link_hit.link_id, 1)
        self.assertEqual(link_hit.remote_ip, '127.0.0.1')
        self.assertEqual(link_hit.referer, 'referer')
        self.assertEqual(link_hit.user_agent, 'user agent')

    def test_as_dict(self):
        with mock.patch.object(time, 'time', return_value=5):
            link_hit = LinkHit(
                link_id=1,
                remote_ip='127.0.0.1',
                referer='referer',
                user_agent='user agent',
            )

        self.assertEqual(link_hit.as_dict(), {
            'hit_id': None,
            'link_id': 1,
            'timestamp': 5,
            'remote_ip': '127.0.0.1',
            'referer': 'referer',
            'user_agent': 'user agent',
        })
