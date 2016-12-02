import models
from linkr import db

from util.exception import *
from database import db_txn
import util.validation


@db_txn
def add_link(alias, outgoing_url):
    """
    Add a new link to the database after performing necessary input validation.

    :param alias: The link alias.
    :param outgoing_url: The associated outgoing URL.
    :return: An instance of models.Link representing the new entry.
    :raises InvalidAliasException: If the alias is invalid.
    :raises InvalidURLException: If the outgoing URL is invalid.
    :raises UnavailableAliasException: If the alias already exists in the database.
    """
    if not util.validation.is_alias_valid(alias):
        raise InvalidAliasException('Alias `{alias}` is not URL safe'.format(alias=alias))
    if not util.validation.is_url_valid(outgoing_url):
        raise InvalidURLException('URL `{url}` is not a valid URL'.format(url=outgoing_url))
    if models.Link.query.filter_by(alias=alias).scalar():
        raise UnavailableAliasException('Alias `{alias}` already exists'.format(alias=alias))

    new_link = models.Link(alias, outgoing_url)
    db.session.add(new_link)

    return new_link


@db_txn
def delete_link(alias):
    """
    Delete a link from the database, if it exists.

    :param alias: The link alias.
    :return: The models.Link instance representing the deleted entry.
    :raises InvalidAliasException: If the alias does not exist.
    """
    to_delete = models.Link.query.filter_by(alias=alias)
    if not to_delete.scalar():
        raise InvalidAliasException('Alias `{alias}` does not exist.'.format(alias=alias))

    to_delete.delete(synchronize_session='fetch')

    return to_delete


def get_link_by_id(link_id):
    """
    Retrieve a link by its ID.

    :param link_id: The ID of the link.
    :return: The models.Link entry, or None if nonexistent.
    """
    return models.Link.query.filter_by(link_id=link_id).first()


def get_link_by_alias(alias):
    """
    Retrieve a link by its alias.

    :param alias: The alias of the link.
    :return: The models.Link entry, or None if nonexistent.
    """
    return models.Link.query.filter_by(alias=alias).first()
