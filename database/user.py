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
    Add a new user to the database after performing necessary input validation.

    :param username: The desired username.
    :param password: The desired password, in plain text (not hashed).
    :param signup_ip: The signup IP address of the user.
    :param is_admin: True for the user to have an admin role; False otherwise.
    :return: The models.User instance representing the newly created user.
    :raises UnavailableUsernameException: If the username is taken by another, existing user.
    :raises InvalidUsernameException: If the desired username fails the validation criteria.
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
def delete_user(user_id):
    """
    Delete a user and all associated links.

    :param user_id: ID of the user to delete.
    :return: The (previously existent) models.User instance that was deleted.
    """
    # Delete the user itself
    to_delete_user = get_user_by_id(user_id)
    if not to_delete_user:
        raise NonexistentUserException('User ID `{user_id}` does not exist'.format(user_id=user_id))
    db.session.delete(to_delete_user)

    # Delete all links associated with the user (if any)
    to_delete_links = models.Link.query.filter_by(user_id=user_id).all()
    for link in to_delete_links:
        db.session.delete(link)

    return to_delete_user


@db_txn
def generate_new_api_key(user_id):
    """
    Generate a new API key for the user.

    :param user_id: The ID of the user for which a new API key should be generated.
    :return: The modified models.User instance.
    :raises NonexistentUserException: If the user does not exist.
    """
    user = get_user_by_id(user_id)
    if not user:
        raise NonexistentUserException('User ID `{user_id}` does not exist'.format(user_id=user_id))

    user.generate_new_api_key()
    db.session.add(user)

    return user


@db_txn
def update_user_password(user_id, new_password):
    """
    Update the password for the specified user.

    :param user_id: The ID of the user for which the password should be updated.
    :param new_password: The new, plain-text password to set on the account.
    :return: The modified models.User instance.
    :raises NonexistentUserException: If the user does not exist.
    """
    user = get_user_by_id(user_id)
    if not user:
        raise NonexistentUserException('User ID `{user_id}` does not exist'.format(user_id=user_id))

    user.update_password(new_password)
    db.session.add(user)

    return user


def validate_user_credentials(username, password):
    """
    Validate a pair of username/password credentials.

    :param username: The username to authenticate.
    :param password: The password of the user, in plain text.
    :return: The models.User instance representing the user.
    """
    user = get_user_by_username(username)
    if not user:
        raise NonexistentUserException(
            'User identified by username `{username}` does not exist'.format(username=username)
        )

    if not user.validate_password(password):
        raise InvalidAuthenticationException('Specified password is incorrect')

    return user


@login_manager.user_loader
def get_user_by_id(user_id):
    """
    Get a models.User instance by ID.

    :param user_id: ID of the user to retrieve.
    :return: The models.User instance with the specified user ID, or None if no such user exists.
    """
    return models.User.query.filter_by(user_id=user_id).first()


def get_user_by_username(username):
    """
    Get a models.User instance by username.

    :param username: Username of the user to retrieve.
    :return: The models.User instance with the specified user username, or None if no such user
             exists.
    """
    return models.User.query.filter_by(username=username).first()


def get_user_by_api_key(api_key):
    """
    Get a models.User instance by API key.

    :param api_key: The user's API key.
    :return: An instance of models.User with the provided API key or None if no user exists with
             the specified API key.
    """
    return models.User.query.filter_by(api_key=api_key).first()


def get_recent_users(page_num=0, num_per_page=100):
    """
    Retrieve a paginated listing of recently created users.

    :param page_num: The page number to use in the pagination, zero-indexed.
    :param num_per_page: The number of links to retrieve per page.
    :return: A list of models.User instances describing recent users, ordered by ID.
    """
    return models.User.query.order_by(
        models.User.user_id.desc()
    ).offset(
        page_num * num_per_page
    ).limit(
        num_per_page
    ).all()
