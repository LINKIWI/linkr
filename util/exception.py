class InvalidAliasException(Exception):
    """
    Raised when an input alias does not meet validity requirements.
    """
    pass


class UnavailableAliasException(Exception):
    """
    Raised when an input alias already exists, and is thus unavailable.
    """
    pass


class InvalidURLException(Exception):
    """
    Raised when an input URL does not meet validity requirements.
    """
    pass


class NonexistentUserException(Exception):
    """
    Raised when an operation is attempted on a user that does not exist.
    """
    pass


class NonexistentLinkException(Exception):
    """
    Raised when an operation is attempted on a link that does not exist.
    """
    pass


class UnavailableUsernameException(Exception):
    """
    Raised when an input username already exists, and is thus unavailable.
    """
    pass


class InvalidUsernameException(Exception):
    """
    Raised when an input username does not meet validity requirements.
    """
    pass


class InvalidAuthenticationException(Exception):
    """
    Raised when a secure operation is attempted, but the authentication failed
    (e.g. a wrong password was supplied).
    """
    pass


class UnauthorizedException(Exception):
    """
    Raised when the user is not allowed to perform an action.
    """
    pass
