import config
import database.user
import util.response
from linkr import app
from uri.user import *
from util.decorators import *
from util.exception import *


@app.route(UserAddURI.path, methods=UserAddURI.methods)
@require_form_args(['username', 'password'])
@optional_login_api
@require_frontend_api
@api_method
def api_add_user(data):
    """
    Add a new user.
    """
    try:
        is_admin = data.get('is_admin')

        if not config.options.server['allow_open_registration']:
            return util.response.error(
                status_code=403,
                message='The server administrator has disabled open user self-registration.',
                failure='failure_open_registration_disabled',
            )

        if is_admin and (not current_user.is_authenticated or not current_user.is_admin):
            return util.response.error(
                status_code=403,
                message='Only admin users may create more admin users.',
                failure='failure_unauth',
            )

        new_user = database.user.add_user(
            username=data['username'],
            password=data['password'],
            signup_ip=request.access_route[0],
            is_admin=is_admin and current_user.is_authenticated and current_user.is_admin,
        )
        return util.response.success({
            'username': new_user.username,
        })
    except UnavailableUsernameException:
        return util.response.error(
            status_code=409,
            message='The requested username is already taken. Please use another username.',
            failure='failure_unavailable_username',
        )
    except InvalidUsernameException:
        return util.response.error(
            status_code=400,
            message='The requested username is invalid; it may only contain letters and numbers.',
            failure='failure_invalid_username',
        )
    except:
        return util.response.undefined_error()


@app.route(UserDeactivationURI.path, methods=UserDeactivationURI.methods)
@require_form_args()
@require_login_api()
@require_frontend_api
@api_method
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


@app.route(UserUpdatePasswordURI.path, methods=UserUpdatePasswordURI.methods)
@require_form_args(['current_password', 'new_password'])
@require_login_api()
@require_frontend_api
@api_method
def api_update_user_password(data):
    """
    Update the password for the currently logged in user.
    """
    try:
        database.user.validate_user_credentials(current_user.username, data['current_password'])

        database.user.update_user_password(
            user_id=current_user.user_id,
            new_password=data['new_password'],
        )

        return util.response.success({
            'user_id': current_user.user_id,
        })
    except NonexistentUserException:
        return util.response.error(
            status_code=404,
            message='No user exists with the specified user ID.',
            failure='failure_nonexistent_user',
        )
    except InvalidAuthenticationException:
        return util.response.error(
            status_code=401,
            message='The supplied current account password is incorrect.',
            failure='failure_invalid_auth',
        )
    except:
        return util.response.undefined_error()


@app.route(UserRegenerateAPIKeyURI.path, methods=UserRegenerateAPIKeyURI.methods)
@require_form_args(['password'])
@require_login_api()
@require_frontend_api
@api_method
def api_regenerate_user_api_key(data):
    """
    Regenerate the API key for the currently logged in user.
    """
    try:
        database.user.validate_user_credentials(current_user.username, data['password'])

        database.user.generate_new_api_key(user_id=current_user.user_id)

        return util.response.success({
            'user_id': current_user.user_id,
        })
    except NonexistentUserException:
        return util.response.error(
            status_code=404,
            message='No user exists with the specified user ID.',
            failure='failure_nonexistent_user',
        )
    except InvalidAuthenticationException:
        return util.response.error(
            status_code=401,
            message='Your account password is incorrect. Please try again.',
            failure='failure_invalid_auth',
        )
    except:
        return util.response.undefined_error()


@app.route(RecentUsersURI.path, methods=RecentUsersURI.methods)
@require_form_args()
@require_login_api(admin_only=True)
@require_frontend_api
@api_method
def api_recent_users(data):
    """
    Retrieve a paginated list of all recently created users.
    """
    expect_args = {'page_num', 'num_per_page'}
    filtered_data = {
        key: value
        for key, value in data.items()
        if key in expect_args
    }

    try:
        users = database.user.get_recent_users(**filtered_data)
        return util.response.success({
            'users': [user.as_dict() for user in users],
        })
    except:
        return util.response.undefined_error()


@app.route(UserSearchURI.path, methods=UserSearchURI.methods)
@require_form_args(['username'])
@require_login_api(admin_only=True)
@require_frontend_api
@api_method
def api_user_search(data):
    """
    Search for users by username.
    """
    try:
        expect_args = {'username', 'page_num', 'num_per_page'}
        filtered_data = {
            key: value
            for key, value in data.items()
            if key in expect_args
        }

        users = database.user.get_users_like_username(**filtered_data)
        return util.response.success({
            'users': [user.as_dict() for user in users],
        })
    except:
        return util.response.undefined_error()
