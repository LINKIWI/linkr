import linkr  # flake8: noqa: F401

import uri.auth
import uri.link
import uri.main
import uri.misc
import uri.user
from test.backend.test_case import LinkrTestCase


class TestURI(LinkrTestCase):
    _multiprocess_can_split_ = True

    def test_properties(self):
        uri_modules = [
            uri.auth,
            uri.link,
            uri.main,
            uri.misc,
            uri.user,
        ]

        uri_classes = {
            uri_module: [
                uri_class
                for uri_class in dir(uri_module)
                if len(uri_class) > 3 and uri_class.endswith('URI')
            ]
            for uri_module in uri_modules
        }

        for uri_module, module_classes in uri_classes.items():
            for module_class in module_classes:
                uri_class = getattr(uri_module, module_class)

                # Every URI class needs to define methods and a path.
                self.assertIsNotNone(getattr(uri_class, 'methods'))
                self.assertIsNotNone(getattr(uri_class, 'path'))
