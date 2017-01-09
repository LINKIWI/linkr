import re
import urlparse

import requests


def is_alias_valid(alias):
    """
    Check if an alias is valid. An alias is considered valid if it contains only URL-safe
    characters and is shorter than a maximum length of 32 characters.

    :param alias: The alias to validate.
    :return: True if the alias is valid; False otherwise.
    """
    return alias == requests.utils.quote(alias, safe='') and 0 < len(alias) < 32


def is_alias_reserved(alias):
    """
    Check if an alias is reserved, and thus unable to be used.

    :param alias: The alias to validate.
    :return: True if the alias is reserved; False otherwise.
    """
    reserved_aliases = [
        'linkr',
    ]
    return alias.lower() in reserved_aliases


def is_url_valid(url):
    """
    Check if a URL is valid. The URL is considered valid if a hostname can be parsed out of the
    input string.

    :param url: The input URL to validate.
    :return: True if the URL is valid; False otherwise.
    """
    return bool(urlparse.urlparse(url).netloc)


def is_username_valid(username):
    """
    Check if a username is valid.

    :param username: The username to validate.
    :return: True if the username is valid; False otherwise.
    """
    valid_username_regex = re.compile('^[a-zA-Z0-9\-_]+$')
    return bool(re.match(valid_username_regex, username))
