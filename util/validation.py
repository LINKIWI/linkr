import re
import requests


# Shoutout to the poor soul who sat down to write this 500+ character regular expression for matching valid URLs.
# Source: https://gist.github.com/dperini/729294
VALID_URL_REGEX = re.compile(
    u"^"
    # protocol identifier
    u"(?:(?:https?|ftp)://)"
    # user:pass authentication
    u"(?:\S+(?::\S*)?@)?"
    u"(?:"
    # IP address exclusion
    # private & local networks
    u"(?!(?:10|127)(?:\.\d{1,3}){3})"
    u"(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})"
    u"(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})"
    # IP address dotted notation octets
    # excludes loopback network 0.0.0.0
    # excludes reserved space >= 224.0.0.0
    # excludes network & broadcast addresses
    # (first & last IP address of each class)
    u"(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])"
    u"(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}"
    u"(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))"
    u"|"
    # host name
    u"(?:(?:[a-z\u00a1-\uffff0-9]-?)*[a-z\u00a1-\uffff0-9]+)"
    # domain name
    u"(?:\.(?:[a-z\u00a1-\uffff0-9]-?)*[a-z\u00a1-\uffff0-9]+)*"
    # TLD identifier
    u"(?:\.(?:[a-z\u00a1-\uffff]{2,}))"
    u")"
    # port number
    u"(?::\d{2,5})?"
    # resource path
    u"(?:/\S*)?"
    u"$",
    re.UNICODE,
)

VALID_USERNAME_REGEX = re.compile('^[a-zA-Z0-9]+$')


def is_alias_valid(alias):
    """
    TODO

    :param alias:
    :return:
    """
    # An alias is considered valid if it contains only URL-safe characters and shorter than a
    # maximum length of 32 characters.
    return alias == requests.utils.quote(alias, safe='') and len(alias) < 32


def is_url_valid(url):
    """
    TODO

    :param url:
    :return:
    """
    return bool(re.match(VALID_URL_REGEX, url))


def is_username_valid(username):
    """
    TODO

    :param username:
    :return:
    """
    return bool(re.match(VALID_USERNAME_REGEX, username))
