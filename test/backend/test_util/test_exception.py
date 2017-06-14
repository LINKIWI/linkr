import linkr  # flake8: noqa: F401

import util.exception
from test.backend.test_case import LinkrTestCase


class TestException(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_exception_naming_convention(self):
        exceptions = [
            property
            for property in dir(util.exception)
            if not property.startswith('__')
        ]

        for exception in exceptions:
            self.assertTrue(
                exception.endswith('Exception'),
                'Expected exception {exception} name to end with string `Exception`'.format(
                    exception=exception,
                ),
            )
