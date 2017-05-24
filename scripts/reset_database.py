# flake8: noqa: F401

import linkr

import models
from database import db_txn


@db_txn
def reset_database():
    models.Link.query.delete()
    models.LinkHit.query.delete()
    models.User.query.filter(models.User.is_admin.is_(False)).delete()


if __name__ == '__main__':
    reset_database()
