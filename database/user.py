import models
import util.cryptography
from database import db_txn
from linkr import db
from linkr import login_manager
from util.exception import *


@db_txn
def add_user(username, password, signup_ip):
    """
    TODO

    :param username:
    :param password:
    :param signup_ip:
    :return:
    """
    new_user = models.User(username, password, signup_ip)
    db.session.add(new_user)
    return new_user


@db_txn
def generate_new_api_key(user_id):
    """
    TODO

    :param user_id:
    :return:
    """
    user = get_user_by_id(user_id)
    user.generate_new_api_key()
    db.session.add(user)
    return user


def validate_user_credentials(username, password):
    """
    TODO

    :param username:
    :param password:
    :return:
    """
    user = get_user_by_username(username)
    if not user:
        raise NonexistentUserException(
            'User identified by username `username` does not exist'.format(username=username)
        )

    if user.password_hash != util.cryptography.secure_hash(password):
        raise InvalidAuthenticationException('Specified password is incorrect')

    return user


def get_user_by_id(user_id):
    """
    TODO

    :param user_id:
    :return:
    """
    return models.User.query.filter_by(user_id=user_id).first()


def get_user_by_username(username):
    """
    TODO

    :param username:
    :return:
    """
    return models.User.query.filter_by(username=username).first()


@login_manager.user_loader
def load_user(user_id):
    """
    TODO

    :param user_id:
    :return:
    """
    return get_user_by_id(user_id)
