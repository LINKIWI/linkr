from functools import wraps

from linkr import db


def db_txn(func):
    """
    Wrapper for any function that executes write operations on the database.

    :param func: The function to execute.
    :return: The original return value of func.
    """
    @wraps(func)
    def decorator(*args, **kwargs):
        return_value = func(*args, **kwargs)
        db.session.commit()
        return return_value
    return decorator
