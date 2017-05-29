from flask_login import logout_user

import database.user
import util.response
from linkr import app
from uri.auth import *
from util.decorators import *
from util.exception import *


@app.route(AuthCheckURI.path, methods=AuthCheckURI.methods)
@require_form_args()
@api_method
def api_auth_check(data):
    """
    Check if any user is currently authenticated.
    """
    try:
        if current_user.is_authenticated:
            return util.response.success({
                'user': current_user.as_dict(),
            })

        return util.response.error(
            status_code=401,
            message='No user is currently authenticated.',
            failure='failure_unauth',
        )
    except:
        return util.response.undefined_error()


@app.route(AuthLoginURI.path, methods=AuthLoginURI.methods)
@require_form_args(['username', 'password', 'remember_me'])
@require_frontend_api
@api_method
def api_auth_login(data):
    """
    Attempt to authenticate the specified user.
    """
    resp_data = {
        'username': data['username'],
    }

    try:
        user = database.user.validate_user_credentials(data['username'], data['password'])
        login_user(user, remember=data['remember_me'])
        return util.response.success(resp_data)
    except InvalidAuthenticationException:
        return util.response.error(
            status_code=401,
            message='The supplied password is incorrect.',
            failure='failure_invalid_auth',
            data=resp_data,
        )
    except NonexistentUserException:
        return util.response.error(
            status_code=404,
            message='The supplied username does not exist.',
            failure='failure_nonexistent_user',
            data=resp_data,
        )
    except:
        return util.response.undefined_error()


@app.route(AuthLogoutURI.path, methods=AuthLogoutURI.methods)
@require_form_args()
@require_frontend_api
@api_method
def api_auth_logout(data):
    """
    Log out the currently authenticated user.
    """
    try:
        logout_user()
        return util.response.success()
    except:
        return util.response.undefined_error()
