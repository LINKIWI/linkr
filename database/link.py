import models
from linkr import db

from util.exception import *
from database import db_txn
import util.validation


@db_txn
def add_link(alias, outgoing_url):
    """
    TODO

    :param alias:
    :param outgoing_url:
    :return:
    """
    if not util.validation.is_alias_valid(alias):
        raise InvalidAliasException('Alias `{alias}` is not URL safe'.format(alias=alias))
    if not util.validation.is_url_valid(outgoing_url):
        raise InvalidURLException('URL `{url}` is not a valid URL'.format(url=outgoing_url))

    new_link = models.Link(alias, outgoing_url)
    db.session.add(new_link)
    return new_link


def get_link_by_id(link_id):
    """
    TODO

    :param link_id:
    :return:
    """
    return models.Link.query.filter_by(link_id=link_id).first()


def get_link_by_alias(alias):
    """
    TODO

    :param alias:
    :return:
    """
    return models.Link.query.filter_by(alias=alias).first()
