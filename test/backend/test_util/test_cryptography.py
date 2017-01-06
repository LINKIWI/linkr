import util.cryptography
from test.backend.test_case import LinkrTestCase


class TestCryptography(LinkrTestCase):
    def test_secure_hash(self):
        self.assertEqual(
            util.cryptography.secure_hash('string', iterations=1),
            'fa8440c5effd6ea4efd71a67048c821949c034dea63a4761c6cb86a5d8f70f0d',
        )
        self.assertEqual(
            util.cryptography.secure_hash('string', iterations=10000),
            '37b7879ef8d16dfa64e14004964aa524d8f33e84a75e14025897b8ba9108f3e7',
        )
