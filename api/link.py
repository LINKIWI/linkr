import sqlite3

import flask

from linkr import app
from util.decorators import *
from util.exception import *
from uri.link import *

import constants
import database.link


@app.route(LinkAddURI.path, methods=LinkAddURI.methods)
@require_form_args(['alias', 'outgoing_url'])
def api_add_link(data):
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
    except sqlite3.IntegrityError:
        return flask.jsonify(constants.UNAVAILABLE_ALIAS_FAILURE), constants.UNAVAILABLE_ALIAS_FAILURE_CODE
    # except:
    #     return flask.jsonify(constants.UNDEFINED_FAILURE), constants.UNDEFINED_FAILURE_CODE
