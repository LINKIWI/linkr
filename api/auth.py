from flask_login import login_user
from flask_login import logout_user
from flask_login import current_user

import database.user
import util.response
from linkr import app
from uri.auth import *
from util.decorators import *
from util.exception import *


@app.route(AuthCheckURI.path, methods=AuthCheckURI.methods)
def auth_check():
    """
    Check if any user is currently authenticated.
    """
    try:
        if current_user.is_authenticated:
            return util.response.success({
                'username': current_user.username,
            })

        return util.response.error(
            401,
            'No user is currently authenticated.',
            'failure_unauthenticated',
        )
    except:
        return util.response.undefined_error()


@app.route(AuthLoginURI.path, methods=AuthLoginURI.methods)
@require_form_args(['username', 'password_hash'])
def auth_login(data):
    """
    Attempt to authenticate the specified user.
    """
    resp_data = {
        'username': data['username'],
    }

    try:
        user = database.user.validate_user_credentials(data['username'], data['password_hash'])
        login_user(user)
        return util.response.success(resp_data)
    except InvalidAuthenticationException:
        return util.response.error(
            401,
            'The supplied password is incorrect.',
            'failure_invalid_auth',
            resp_data,
        )
    except NonexistentUserException:
        return util.response.error(
            404,
            'The supplied username does not exist.',
            'failure_nonexistent_user',
            resp_data,
        )
    except:
        return util.response.undefined_error()


@app.route(AuthLogoutURI.path, methods=AuthLogoutURI.methods)
def auth_logout():
    """
    Log out the currently authenticated user.
    """
    try:
        logout_user()
        return util.response.success()
    except:
        return util.response.undefined_error()
