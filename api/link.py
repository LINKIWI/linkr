import flask

import constants
import database.link
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
        return flask.jsonify({
            constants.RESULT: constants.RESULT_SUCCESS,
            constants.MESSAGE: None,
            'alias': new_link.alias,
            'outgoing_url': new_link.outgoing_url,
        }), constants.SUCCESS_CODE
    except InvalidAliasException:
        return flask.jsonify(constants.INVALID_ALIAS_FAILURE), constants.INVALID_ALIAS_FAILURE_CODE
    except InvalidURLException:
        return flask.jsonify(constants.INVALID_URL_FAILURE), constants.INVALID_URL_FAILURE_CODE
    except UnavailableAliasException:
        return flask.jsonify(constants.UNAVAILABLE_ALIAS_FAILURE), constants.UNAVAILABLE_ALIAS_FAILURE_CODE
    except:
        return flask.jsonify(constants.UNDEFINED_FAILURE), constants.UNDEFINED_FAILURE_CODE


@app.route(LinkDeleteURI.path, methods=LinkDeleteURI.methods)
@require_form_args(['alias'])
def api_delete_link(data):
    """
    Delete an existing link.
    """
    try:
        database.link.delete_link(data['alias'])
        return flask.jsonify({
            constants.RESULT: constants.RESULT_SUCCESS,
            constants.MESSAGE: None,
            'alias': data['alias'],
        }), constants.SUCCESS_CODE
    except InvalidAliasException:
        return flask.jsonify(constants.NONEXISTENT_ALIAS_FAILURE), constants.NONEXISTENT_ALIAS_FAILURE_CODE
    except:
        return flask.jsonify(constants.UNDEFINED_FAILURE), constants.UNDEFINED_FAILURE_CODE
