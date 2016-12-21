import config.options


class URI:
    fqdn = config.options.LINKR_URL
    path = '/'
    methods = ['GET']

    def __init__(self):
        pass

    @classmethod
    def uri(cls, **kwargs):
        """
        TODO

        :param kwargs:
        :return:
        """
        embedded_params = set([key for key in kwargs if '<{key}>'.format(key=key) in cls.path])
        params = [
            '{key}={param}'.format(key=key, param=param)
            for key, param in kwargs.items()
            if key != 'https' and key not in embedded_params and len(str(param)) > 0
        ]
        uri_str = str(cls.path)
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
        TODO

        :param kwargs:
        :return:
        """
        return cls.fqdn + cls.uri(**kwargs)

    @classmethod
    def get_path(cls):
        """
        TODO

        :return:
        """
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
