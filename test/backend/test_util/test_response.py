import json

import util.response
from test.backend.test_case import LinkrTestCase


class TestResponse(LinkrTestCase):
    def test_success_generic(self):
        resp, status = util.response.success()

        self.assertEqual(status, 200)
        self.assertEqual(json.loads(resp.data), {
            'success': True,
            'message': None,
        })

    def test_success_override(self):
        resp, status = util.response.success(
            data={
                'message': 'override',
                'data': {},
            },
            status_code=201,
        )

        self.assertEqual(status, 201)
        self.assertEqual(json.loads(resp.data), {
            'success': True,
            'message': 'override',
            'data': {},
        })

    def test_error(self):
        resp, status = util.response.error(
            status_code=404,
            message='message',
            failure='failure',
            data={
                'stuff': True,
            },
        )

        self.assertEqual(status, 404)
        self.assertEqual(json.loads(resp.data), {
            'success': False,
            'message': 'message',
            'failure': 'failure',
            'stuff': True,
        })

    def test_undefined_error(self):
        resp, status = util.response.undefined_error()

        self.assertEqual(status, 500)
        self.assertEqual(json.loads(resp.data), {
            'success': False,
            'message': 'There was an undefined server-side failure. This is probably a bug.',
            'failure': 'failure_undefined',
        })
