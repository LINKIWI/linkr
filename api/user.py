from flask_login import logout_user

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


@app.route(UserDeactivationURI.path, methods=UserDeactivationURI.methods)
@require_form_args()
@require_login_api()
def api_deactivate_user(data):
    """
    Deactivate a user.
    """
    try:
        user_id = data.get('user_id', current_user.user_id)

        # Then, validate that the desired user ID is either the currently logged in user (a user
        # requesting deactivation of his or her own account), or that the currently logged in user
        # is an admin (who is allowed to deactivate anyone at will).
        if user_id == current_user.user_id or current_user.is_admin:
            database.user.delete_user(user_id=user_id)
            return util.response.success({
                'user_id': user_id,
            })

        # If the user to delete is the currently logged in user, log him or her out.
        if user_id == current_user.user_id:
            logout_user()

        return util.response.error(
            status_code=403,
            message='You can only deactivate your own account.',
            failure='failure_unauth',
        )
    except NonexistentUserException:
        return util.response.error(
            status_code=404,
            message='No user exists with the specified user ID.',
            failure='failure_nonexistent_user',
        )
    except:
        return util.response.undefined_error()
