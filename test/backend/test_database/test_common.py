import linkr  # flake8: noqa: F401

import mock

import database.common
from linkr import db
from test.backend.test_case import LinkrTestCase


class TestCommon(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_create_tables(self):
        with mock.patch.object(db, 'create_all') as mock_create:
            database.common.create_tables()

            self.assertTrue(mock_create.called)
