import util.config_io


client_config = util.config_io.read_config('config/secrets/client.json')
server_config = util.config_io.read_config('config/secrets/server.json')


def client(key):
    """
    Get the value of a client config secret.

    :param key: Dot-delimited key for the config secret.
    :return: The value of the config secret, or None if it does not exist.
    """
    return util.config_io.get_property(client_config, key.split('.'))


def server(key):
    """
    Get the value of a server config secret.

    :param key: Dot-delimited key for the config secret.
    :return: The value of the config secret, or None if it does not exist.
    """
    return util.config_io.get_property(server_config, key.split('.'))
