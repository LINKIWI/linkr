import json


def read_config(file_name):
    """
    Read the JSON contents of a config file by its file name.

    :param file_name: Name of the config file.
    :return: A dictionary representation of the JSON config file.
    """
    return json.loads(open(file_name).read())


def get_property(config_values, path):
    """
    Safely retrieve a config value by a list-defined config key path.

    :param config_values: Dictionary of config values.
    :param path: List of strings representing nested keys into the dictionary.
    :return: The value of the requested path, or None if it does not exist.
    """
    if not config_values or not path:
        return None

    if len(path) == 1:
        return config_values.get(path[0]) if path[0] else config_values

    return get_property(config_values.get(path[0]), path[1:])
