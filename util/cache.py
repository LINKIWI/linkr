TAG_SPA_TOKEN = 'tag-spa-token'


def format_key(tag, key):
    """
    Format a key for insertion into the Redis cache.

    :param tag: Tag associated with this key.
    :param key: The actual key.
    :return: A formatted key for insertion into the cache.
    """
    return '{tag}:{key}'.format(tag=tag, key=key)
