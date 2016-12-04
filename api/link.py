import database.link
import util.response
from linkr import app
from uri.link import *
from util.decorators import *
from util.exception import *


@app.route(LinkAddURI.path, methods=LinkAddURI.methods)
@require_form_args(['alias', 'outgoing_url'])
def api_add_link(data):
    """
    Add a new link (alias <-> outgoing URL association).
    """
    try:
        new_link = database.link.add_link(data['alias'], data['outgoing_url'])
        return util.response.success({
            'alias': new_link.alias,
            'outgoing_url': new_link.outgoing_url,
        })
    except InvalidAliasException:
        return util.response.error(
            400,
            'The requested alias is invalid; it is not URL-safe. Remove all URL-unsafe characters.',
            'failure_invalid_alias',
        )
    except InvalidURLException:
        return util.response.error(
            400,
            'The requested URL is invalid.',
            'failure_invalid_url',
        )
    except UnavailableAliasException:
        return util.response.error(
            409,
            'The requested alias is already taken.',
            'failure_unavailable_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkDeleteURI.path, methods=LinkDeleteURI.methods)
@require_form_args(['alias'])
def api_delete_link(data):
    """
    Delete an existing link.
    """
    try:
        database.link.delete_link(data['alias'])
        return util.response.success({
            'alias': data['alias'],
        })
    except InvalidAliasException:
        return util.response.error(
            404,
            'The requested alias does not exist.',
            'failure_nonexistent_alias',
        )
    except:
        return util.response.undefined_error()
