import random
import types

import database.link
import database.user


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
        pass  # pragma: no cover

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
        raise NotImplementedError  # pragma: no cover


class LinkFactory(Factory):
    """
    Test factory for creating a link.
    """

    @classmethod
    def generate(
        cls,
        alias=random_alphanumeric_string,
        outgoing_url='https://google.com',
        password=None,
        user_id=lambda: random.getrandbits(16),
        require_recaptcha=False,
    ):
        return database.link.add_link(
            alias=cls.random_or_specified_value(alias),
            outgoing_url=cls.random_or_specified_value(outgoing_url),
            password=cls.random_or_specified_value(password),
            user_id=cls.random_or_specified_value(user_id),
            require_recaptcha=cls.random_or_specified_value(require_recaptcha),
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


class UserFactory(Factory):
    """
    Test factory for creating a user.
    """

    @classmethod
    def generate(
        cls,
        username=random_alphanumeric_string,
        password=random_alphanumeric_string,
        signup_up='127.0.0.1',
        is_admin=False,
    ):
        return database.user.add_user(
            username=cls.random_or_specified_value(username),
            password=cls.random_or_specified_value(password),
            signup_ip=cls.random_or_specified_value(signup_up),
            is_admin=cls.random_or_specified_value(is_admin),
        )
