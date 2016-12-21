import config.options
import database.user
import util.response
from linkr import app
from uri.user import *
from util.decorators import *
from util.exception import *


@app.route(UserAddURI.path, methods=UserAddURI.methods)
@require_form_args(['username', 'password'])
def api_add_user(data):
    """
    Add a new user.
    """
    try:
        if not config.options.ALLOW_OPEN_REGISTRATION:
            return util.response.error(
                403,
                'The server administrator has disabled open user self-registration.',
                'failure_open_registration_disabled',
            )

        new_user = database.user.add_user(data['username'], data['password'], request.remote_addr)
        return util.response.success({
            'username': new_user.username,
        })
    except UnavailableUsernameException:
        return util.response.error(
            409,
            'The requested username is already taken. Please use another username.',
            'failure_unavailable_username',
        )
    except InvalidUsernameException:
        return util.response.error(
            400,
            'The requested username is invalid; it may only contain letters and numbers.',
            'failure_invalid_username',
        )
    except:
        return util.response.undefined_error()
