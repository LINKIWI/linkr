from Crypto.Hash import SHA256


def secure_hash(s, iterations=10000):
    """
    Performs several iterations of a SHA256 hash of a plain-text string to generate a secure hash.

    :param s: Input string to hash
    :param iterations: Number of hash iterations to use
    :return: A string representing a secure hash of the string
    """
    hash_result = SHA256.new(data=str(s)).hexdigest()
    for i in range(iterations):
        hash_result = SHA256.new(data=hash_result).hexdigest()
    return hash_result
