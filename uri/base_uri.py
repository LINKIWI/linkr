import hashlib
import hmac

import config


class URI:
    fqdn = config.options.server('linkr_url')
    path = '/'
    methods = ['GET']

    def __init__(self):
        pass  # pragma: no cover

    @classmethod
    def uri(cls, **kwargs):
        """
        Generate a URI with optional params and embedded params.

        :param kwargs: Keyword arguments for the params and embedded params.
        :return: Formatted URI string.
        """
        secure_frontend_requests = config.options.server('secure_frontend_requests')
        embedded_params = set([
            key for key in kwargs
            if '<{key}>'.format(key=key) in cls.get_path(secure=secure_frontend_requests)
        ])
        params = [
            '{key}={param}'.format(key=key, param=param)
            for key, param in kwargs.items()
            if key != 'https' and key not in embedded_params and len(str(param)) > 0
        ]
        uri_str = str(cls.get_path(secure=secure_frontend_requests))
        for embedded_param in embedded_params:
            uri_str = uri_str.replace(
                '<{key}>'.format(key=embedded_param),
                str(kwargs[embedded_param])
            )
        if params:
            uri_str += '?{params}'.format(params='&'.join(params))
        return uri_str

    @classmethod
    def full_uri(cls, **kwargs):
        """
        Generate the full URI (including the FQDN).

        :param kwargs: Optional params and embedded params.
        :return: Formatted full URI string.
        """
        return cls.fqdn + cls.uri(**kwargs)

    @classmethod
    def get_path(cls, secure=False):
        """
        Get the path associated with this URI.

        :param secure: True to generate a secure path; False to use standard plain-text path.
        :return: This URI's path or a secure representation thereof.
        """
        secure_frontend_requests = config.options.server('secure_frontend_requests')
        is_api_uri = cls.path.startswith('/linkr/api')

        # API endpoints should be encrypted if this endpoint is specified as frontend-only and the
        # relevant configuration option is enabled.
        if secure and secure_frontend_requests and is_api_uri:
            digest = hmac.new(
                key=config.flask.SECRET_KEY,
                msg=cls.path,
                digestmod=hashlib.sha256,
            ).hexdigest()
            return '/linkr/{digest}'.format(digest=digest)

        return cls.path

    @classmethod
    def view_uri(cls, path):
        """
        Generate the Linkr URI for a standard page.

        :param path: Desired path.
        :return: A formatted Linkr URI for the view.
        """
        return '/linkr{path}'.format(path=path)

    @classmethod
    def api_uri(cls, path):
        """
        Generate the Linkr URI for an API endpoint.

        :param path: Desired path.
        :return: A formatted Linkr URI for the API endpoint.
        """
        return '/linkr/api{path}'.format(path=path)
