from functools import wraps

from linkr import db


def db_txn(func):
    """
    TODO
    """
    @wraps(func)
    def decorator(*args, **kwargs):
        return_value = func(*args, **kwargs)
        db.session.commit()
        return return_value
    return decorator
