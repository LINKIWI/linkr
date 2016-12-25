import models
import util.cryptography
import util.validation
from database import db_txn
from linkr import db
from linkr import login_manager
from util.exception import *


@db_txn
def add_user(username, password, signup_ip, is_admin=False):
    """
    TODO

    :param username:
    :param password:
    :param signup_ip:
    :param is_admin:
    :return:
    """
    if models.User.query.filter_by(username=username).scalar() is not None:
        raise UnavailableUsernameException('The username `{username}` is already taken'.format(
            username=username,
        ))

    if not util.validation.is_username_valid(username):
        raise InvalidUsernameException('The username `{username}` is invalid'.format(
            username=username,
        ))

    new_user = models.User(
        username=username,
        password=password,
        signup_ip=signup_ip,
        is_admin=is_admin,
    )
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
            'User identified by username `{username}` does not exist'.format(username=username)
        )

    if not user.validate_password(password):
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
