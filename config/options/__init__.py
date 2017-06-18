import util.config_io

default_client = {
    'piwik': {
        'url': None,
        'siteId': None,
    },
    'enable_recent_links': True,
}

default_server = {
    'linkr_url': 'http://localhost:5000',
    'require_login_to_create': False,
    'allow_open_registration': True,
    'secure_frontend_requests': True,
}

client_config = dict(default_client, **util.config_io.read_config('config/options/client.json'))
server_config = dict(default_server, **util.config_io.read_config('config/options/server.json'))


def client(key):
    """
    Get the value of a client config option.

    :param key: Dot-delimited key for the config option.
    :return: The value of the config option, or None if it does not exist.
    """
    return util.config_io.get_property(client_config, key.split('.'))


def server(key):
    """
    Get the value of a server config option.

    :param key: Dot-delimited key for the config option.
    :return: The value of the config option, or None if it does not exist.
    """
    return util.config_io.get_property(server_config, key.split('.'))
