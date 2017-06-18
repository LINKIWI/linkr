import json


def read_config(file_name):
    return json.loads(open(file_name).read())


def get_property(config_values, path):
    if not config_values:
        return None

    if len(path) == 1:
        return config_values.get(path[0]) if path[0] else config_values

    return get_property(config_values.get(path[0]), path[1:])
