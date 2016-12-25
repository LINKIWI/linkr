from functools import wraps

from flask import request
from flask_login import current_user
from flask_login import login_user

import database.user
import util.response


def require_form_args(form_args, allow_blank_values=False, strict_params=False):
    """
    Require this endpoint function to be requested with at least the specified parameters in its
    JSON body.

    Example usage for an endpoint that requires, at minimum, the params 'username' and 'password':

      @app.route('/', methods=['POST'])
      @require_form_args(['username', 'password'])
      def view_function():
          pass

    On failure, returns HTTP status code 400 with a predefined failure_incomplete_params response.

    :param form_args: Comma-separated strings representing required POST params.
    :param allow_blank_values: True to explicitly consider an empty value as a valid param value.
    :param strict_params: True to check if the POST request params are strictly equal to form_args.
                          False by default, thereby considering the request valid if there are extra
                          arguments.
    """
    def decorator(func):
        @wraps(func)
        def abort_if_invalid_args(*args, **kwargs):
            data = request.get_json(force=True, silent=True) or {}

            if (len(form_args) > 0 and not data) or \
                    (not strict_params and not set(form_args).issubset(data.keys())) or \
                    (strict_params and set(form_args) != set(data.keys())) or \
                    (not allow_blank_values and not all([
                        data[arg] is not None and len(unicode(data[arg])) > 0 for arg in form_args
                    ])):
                return util.response.error(
                    400,
                    'Required parameters are missing',
                    'failure_incomplete_params',
                    {
                        'missing_params': list(set(form_args).difference(set(data.keys()))),
                    },
                )
            return func(data, *args, **kwargs)

        return abort_if_invalid_args

    return decorator


def require_login_api(admin_only=False):
    """
    A custom implementation of Flask-login's built-in @login_required decorator.
    This decorator will allow usage of the API endpoint if the user is either currently logged in
    via the app or if the user authenticates with an API key in the POSTed JSON parameters.
    This implementation overrides the behavior taken when the current user is not authenticated by
    returning a predefined auth failure response with HTTP status code 401.

    This decorator is intended for use with API endpoints, and REQUIRES use of require_form_args on
    the same view function. Example usage for an authentication-required endpoint:

      @app.route('/', methods=['POST'])
      @require_form_args([])
      @require_login_api
      def view_function():
          pass

    :param admin_only: True to only allow admin users to access this endpoint; False to allow any
                       authenticated user.
    """
    def decorator(func):
        @wraps(func)
        def validate_auth(data, *args, **kwargs):
            if current_user.is_authenticated and (not admin_only or current_user.is_admin):
                return func(data, *args, **kwargs)

            if data.get('api_key'):
                user = database.user.get_user_by_api_key(data['api_key'])
                if user and (not admin_only or user.is_admin):
                    # Log the user in before servicing the request, passing along the input data to
                    # the API endpoint, excluding sensitive information (API key).
                    login_user(user)
                    del data['api_key']
                    return func(data, *args, **kwargs)
                elif not user:
                    return util.response.error(
                        status_code=401,
                        message='The supplied API key is invalid.',
                        failure='failure_unauth',
                    )
                else:
                    return util.response.error(
                        status_code=403,
                        message='Only admin users are allowed to access this endpoint.',
                        failure='failure_unauth',
                    )

            else:
                return util.response.error(
                    status_code=403,
                    message='You must be authenticated to access this endpoint.',
                    failure='failure_unauth',
                )
        return validate_auth

    return decorator


def optional_login_api(func):
    """
    This decorator is similar in behavior to require_login_api, but is intended for use with
    endpoints that offer extended functionality with a login, but can still be used without any
    authentication.

    The decorator will set current_user if authentication via an API key is provided, and will
    continue without error otherwise.

    This decorator is intended for use with API endpoints, and REQUIRES use of require_form_args on
    the same view function. Example usage for an authentication-required endpoint:

      @app.route('/', methods=['POST'])
      @require_form_args([])
      @optional_login_api
      def view_function():
          pass

    :param func: The wrapped API endpoint function.
    """
    @wraps(func)
    def decorator(data, *args, **kwargs):
        if current_user.is_authenticated:
            return func(data, *args, **kwargs)

        if data.get('api_key'):
            user = database.user.get_user_by_api_key(data['api_key'])
            if user:
                login_user(user)
                del data['api_key']

        return func(data, *args, **kwargs)

    return decorator
