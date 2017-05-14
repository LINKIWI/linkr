import models
import util.validation
from database import db_txn
from linkr import db
from util.exception import *


@db_txn
def add_link(alias, outgoing_url, password=None, user_id=None, require_recaptcha=False):
    """
    Add a new link to the database after performing necessary input validation.

    :param alias: The link alias.
    :param outgoing_url: The associated outgoing URL.
    :param password: Plain-text password associated with this link, if applicable.
    :param user_id: ID of the user to associate with this link, if applicable.
    :param require_recaptcha: True to require ReCAPTCHA for accessing this link; False otherwise.
    :return: An instance of models.Link representing the new entry.
    :raises InvalidAliasException: If the alias is invalid.
    :raises ReservedAliasException: If the alias is reserved.
    :raises InvalidURLException: If the outgoing URL is invalid.
    :raises UnavailableAliasException: If the alias already exists in the database.
    """
    if not util.validation.is_alias_valid(alias):
        raise InvalidAliasException('Alias `{alias}` is not URL safe'.format(alias=alias))
    if util.validation.is_alias_reserved(alias):
        raise ReservedAliasException('Alias `{alias}` is reserved'.format(alias=alias))
    if not util.validation.is_url_valid(outgoing_url):
        raise InvalidURLException('URL `{url}` is not a valid URL'.format(url=outgoing_url))
    if models.Link.query.filter_by(alias=alias).scalar():
        raise UnavailableAliasException('Alias `{alias}` already exists'.format(alias=alias))

    new_link = models.Link(
        alias=alias,
        outgoing_url=outgoing_url,
        password=password,
        user_id=user_id,
        require_recaptcha=require_recaptcha,
    )
    db.session.add(new_link)

    return new_link


@db_txn
def edit_link(link_id, alias=None, outgoing_url=None):
    """
    Edit an existing link's details.

    :param link_id: The ID of the link to edit.
    :param alias: The new alias of the link, or None to leave it unchanged.
    :param outgoing_url: The new outgoing URL of the link, or None to leave it unchanged.
    :return: The models.Link instance representing the modified link object.
    :raises InvalidAliasException: If the alias is invalid.
    :raises InvalidURLException: If the outgoing URL is invalid.
    :raises NonexistentLinkException: If no link exists with the provided link ID.
    """
    to_modify = get_link_by_id(link_id)
    if not to_modify:
        raise NonexistentLinkException('No link exists with link ID `{link_id}`'.format(
            link_id=link_id,
        ))

    if alias and not util.validation.is_alias_valid(alias):
        raise InvalidAliasException('Alias `{alias}` is not URL safe'.format(alias=alias))

    if alias and util.validation.is_alias_reserved(alias):
        raise ReservedAliasException('Alias `{alias}` is reserved'.format(alias=alias))

    if outgoing_url and not util.validation.is_url_valid(outgoing_url):
        raise InvalidURLException('URL `{url}` is not a valid URL'.format(url=outgoing_url))

    to_modify.edit(alias=alias, outgoing_url=outgoing_url)

    db.session.add(to_modify)

    return to_modify


@db_txn
def update_link_password(link_id, password):
    """
    Update a link's password. This method allows both adding a password to a previously
    non-password-protected link, changing the password on a password-protected link, and removing
    the password from a password-protected link.

    :param link_id: ID of the link for which the password should be updated.
    :param password: The new link password.
    :return: The models.Link instance representing the modified Link object.
    """
    to_modify = get_link_by_id(link_id)
    if not to_modify:
        raise NonexistentLinkException('No link exists with link ID `{link_id}`'.format(
            link_id=link_id,
        ))

    to_modify.update_password(password)

    db.session.add(to_modify)

    return to_modify


@db_txn
def delete_link(link_id):
    """
    Delete a link from the database, if it exists.

    :param link_id: The link ID to delete.
    :return: The models.Link instance representing the deleted entry.
    :raises NonexistentLinkException: If the link ID does not exist.
    """
    to_delete = models.Link.query.filter_by(link_id=link_id)
    if not to_delete.scalar():
        raise NonexistentLinkException('Link ID `{link_id}` does not exist.'.format(
            link_id=link_id,
        ))

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
    :raises NonexistentLinkException: If the link ID does not exist.
    """
    associated_link = models.Link.query.filter_by(link_id=link_id)
    if not associated_link.scalar():
        raise NonexistentLinkException('Link ID `{link_id}` does not exist.'.format(
            link_id=link_id,
        ))

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


def get_links_like_alias(alias, page_num=0, num_per_page=100):
    """
    Retrieve links whose aliases contain the input.

    :param alias: A substring of an actual alias.
    :param page_num: The page number to use in the pagination, zero-indexed.
    :param num_per_page: The number of links to retrieve per page.
    :return: All models.Link instances whose aliases is a superstring of the input.
    """
    return models.Link.query.filter(
        models.Link.alias.like('%{alias}%'.format(alias=alias))
    ).offset(
        page_num * num_per_page
    ).limit(
        num_per_page
    ).all()


def get_links_for_user(user_id, page_num=0, num_per_page=100):
    """
    Retrieve a paginated listing of all links created by a user.

    :param user_id: The ID of the user for which links should be retrieved.
    :param page_num: The page number to use in the pagination, zero-indexed.
    :param num_per_page: The number of links to retrieve per page.
    :return: A list of models.Link objects describing the links created by the specified user.
    """
    if not models.User.query.filter_by(user_id=user_id).scalar():
        raise NonexistentUserException('No user exists with user_id `{user_id}`'.format(
            user_id=user_id,
        ))

    return models.Link.query.filter_by(
        user_id=user_id
    ).order_by(
        models.Link.link_id.asc()
    ).offset(
        page_num * num_per_page
    ).limit(
        num_per_page
    ).all()


def get_recent_links(page_num=0, num_per_page=100):
    """
    Retrieve paginated listing of recently created links.

    :param page_num: The page number to use in the pagination, zero-indexed.
    :param num_per_page: The number of links to retrieve per page.
    :return: A list of models.Link instances describing recent links, ordered by timestamp (most
             recent first).
    """
    return models.Link.query.order_by(
        models.Link.link_id.desc()
    ).offset(
        page_num * num_per_page
    ).limit(
        num_per_page
    ).all()
