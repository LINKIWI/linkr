import linkr  # flake8: noqa: F401

import views.main
from test.backend.factory import LinkFactory
from test.backend.test_case import LinkrTestCase


class TestMain(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_alias_route_nonexistent_link_get(self):
        frontend = views.main.frontend()

        resp = self.client.get('/alias')

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data.decode('utf-8'), frontend)

    def test_alias_route_nonexistent_link_post(self):
        resp = self.client.post('/alias')

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json, {
            'success': False,
            'failure': 'failure_nonexistent_link',
            'message': 'The requested link alias does not exist.',
        })

    def test_alias_route_password_protected_get(self):
        frontend = views.main.frontend()
        LinkFactory.generate(alias='alias', password='password')

        resp = self.client.get('/alias')

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data.decode('utf-8'), frontend)

    def test_alias_route_password_protected_post(self):
        LinkFactory.generate(alias='alias', password='password')

        resp = self.client.post('/alias')

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json, {
            'success': False,
            'failure': 'failure_incorrect_link_password',
            'message': 'The supplied link password is incorrect.',
        })

    def test_alias_route_recaptcha_get(self):
        frontend = views.main.frontend()
        LinkFactory.generate(alias='alias', password=None, require_recaptcha=True)

        resp = self.client.get('/alias')

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data.decode('utf-8'), frontend)

    def test_alias_route_recaptcha_post(self):
        LinkFactory.generate(alias='alias', password=None, require_recaptcha=True)

        resp = self.client.post('/alias')

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json, {
            'success': False,
            'failure': 'failure_invalid_recaptcha',
            'message': 'This link requires human verification, and can only be accessed '
                       'interactively via a browser.',
        })

    def test_alias_route_redirect(self):
        LinkFactory.generate(
            alias='alias',
            outgoing_url='https://google.com',
            password=None,
            require_recaptcha=False,
        )

        resp = self.client.get('/alias')

        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.headers['Location'], 'https://google.com')

    def test_frontend(self):
        self.assertIsNotNone(views.main.frontend())
