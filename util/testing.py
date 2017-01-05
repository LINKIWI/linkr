import random
import types

from flask_testing import TestCase

from linkr import app
from linkr import db
import database.link


def random_alphanumeric_string(length=16):
    """
    Generate a random alphanumeric string of the specified length.

    :param length: Length of the random string
    :return: A random string of length length containing only alphabetic and numeric characters
    """
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    numbers = '0123456789'
    available_chars = list(alphabet.lower()) + list(alphabet.upper()) + list(numbers)
    return ''.join([random.choice(available_chars) for _ in xrange(length)])


class Factory:
    """
    Factory superclass, outlining how factories should be defined.
    """

    def __init__(self):
        pass

    @classmethod
    def random_or_specified_value(cls, value):
        """
        Helper utility for choosing between a user-specified value for a field or a randomly
        generated value.

        :param value: Either a lambda type or a non-lambda type.
        :return: The value itself if not a lambda type, otherwise the value of the evaluated
                 lambda (random value)
        """
        return value() if isinstance(value, types.FunctionType) else value

    @classmethod
    def generate(cls, *args, **kwargs):
        """
        Generates an instance of the requested model and adds it to the test database.
        This method should be overridden by subclasses.

        :return: An instance of the model specified by the subclass type.
        """
        raise NotImplementedError


class LinkFactory(Factory):
    """
    Test factory for creating a link.
    """

    @classmethod
    def generate(
        cls,
        alias=random_alphanumeric_string,
        outgoing_url='https://google.com',
        password=random_alphanumeric_string,
        user_id=lambda: random.getrandbits(16),
    ):
        return database.link.add_link(
            alias=cls.random_or_specified_value(alias),
            outgoing_url=cls.random_or_specified_value(outgoing_url),
            password=cls.random_or_specified_value(password),
            user_id=cls.random_or_specified_value(user_id),
        )


class LinkHitFactory(Factory):
    """
    Test factory for creating a link hit.
    """

    @classmethod
    def generate(
        cls,
        link_id=lambda: random.getrandbits(16),
        remote_ip='127.0.0.1',
        referer=random_alphanumeric_string,
        user_agent=random_alphanumeric_string,
    ):
        return database.link.add_link_hit(
            link_id=cls.random_or_specified_value(link_id),
            remote_ip=cls.random_or_specified_value(remote_ip),
            referer=cls.random_or_specified_value(referer),
            user_agent=cls.random_or_specified_value(user_agent),
        )


class LinkrTestCase(TestCase):
    """
    Generic subclass of TestCase with Linkr-specific test environment initialization for database
    testing.
    """

    def create_app(self):
        """
        Initializes the test Flask application by setting the app config parameters appropriately.
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_TEST_DATABASE_URI']

        return app

    def setUp(self):
        """
        Initialize a test database environment.
        """
        self.client = app.test_client()
        db.create_all()

    def tearDown(self):
        """
        Destroys the test database environment, resetting it to a clean state.
        """
        db.session.remove()
        db.drop_all()
