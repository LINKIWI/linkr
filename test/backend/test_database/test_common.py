import mock
from linkr import db
import database.common
from test.backend.test_case import LinkrTestCase


class TestCommon(LinkrTestCase):
    def test_create_tables(self):
        with mock.patch.object(db, 'create_all') as mock_create:
            database.common.create_tables()

            self.assertTrue(mock_create.called)
