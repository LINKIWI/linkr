import linkr  # flake8: noqa: F401

import json

import mock

import util.config_io
from test.backend.test_case import LinkrTestCase


class TestConfigIO(LinkrTestCase):
    _multiprocess_can_split_ = True

    @mock.patch.object(
        util.config_io,
        'open',
        mock.mock_open(read_data=json.dumps({'key': 'value'})),
    )
    def test_read_config(self):
        self.assertEqual(util.config_io.read_config('name'), {'key': 'value'})

    def test_get_property_valid(self):
        self.assertEqual(util.config_io.get_property({'a': 2}, ['a']), 2)
        self.assertEqual(util.config_io.get_property({'a': {'b': 3}}, ['a', 'b']), 3)

    def test_get_property_nonexistent(self):
        self.assertIsNone(util.config_io.get_property(None, []))
        self.assertIsNone(util.config_io.get_property(None, ['a']))
        self.assertIsNone(util.config_io.get_property({}, ['a']))
