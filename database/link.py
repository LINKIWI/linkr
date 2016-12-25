import models
import util.validation
from database import db_txn
from linkr import db
from util.exception import *


@db_txn
def add_link(alias, outgoing_url, password=None, user_id=None):
    """
    Add a new link to the database after performing necessary input validation.

    :param alias: The link alias.
    :param outgoing_url: The associated outgoing URL.
    :param password: Plain-text password associated with this link, if applicable.
    :param user_id: ID of the user to associate with this link, if applicable.
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

    new_link = models.Link(
        alias=alias,
        outgoing_url=outgoing_url,
        password=password,
        user_id=user_id,
    )
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


@db_txn
def add_link_hit(link_id, remote_ip, referer, user_agent):
    """
    Add a new link hit.

    :param link_id: ID of the accessed link.
    :param remote_ip: The remote IP address of the client.
    :param referer: The referer of the hit.
    :param user_agent: The client's user agent string.
    :return: An instance of models.LinkHit representing the added entry.
    """
    new_link_hit = models.LinkHit(
        link_id=link_id,
        remote_ip=remote_ip,
        referer=referer,
        user_agent=user_agent,
    )
    db.session.add(new_link_hit)

    return new_link_hit


def get_link_hits_by_id(link_id, page_num=0, num_per_page=100):
    """
    Retrieve paginated listing of link hits for a particular link ID.

    :param link_id: The link ID whose hits should be retrieved.
    :param page_num: The page number to use in the pagination, zero-indexed.
    :param num_per_page: The number of hits to retrieve per page.
    :return: A list of models.LinkHit instances describing link hits, ordered by timestamp (most
             recent first).
    """
    return models.LinkHit.query.filter_by(
        link_id=link_id,
    ).order_by(
        models.LinkHit.hit_id.desc()
    ).offset(
        page_num * num_per_page
    ).limit(
        num_per_page
    ).all()


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


def get_links_for_user(user_id):
    """
    Retrieve all links created by a user.

    :param user_id: The ID of the user for which links should be retrieved.
    :return: A list of models.Link objects describing the links created by the specified user.
    """
    return models.Link.query.filter_by(user_id=user_id).all()
