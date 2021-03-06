import threading
import time
from functools import wraps

import statsd
import strgen
from flask import make_response
from flask import request
from flask_login import current_user
from flask_login import login_user

import config as base_config
import database.user
import util.cache
import util.response
from linkr import cache

COOKIE_SPA_TOKEN = 'linkr-spa-token'


def time_request(bucket):
    """
    Time the request and send the duration to statsd as a timing event under the specified bucket.

    This decorator sits at the highest level, and is used as follows:

      @time_request('my.bucket.name')
      @app.route('/')
      def view_function():
          pass

    :param bucket: Name of the statsd bucket for this latency stat.
    """
    def decorator(func):
        @wraps(func)
        def proxy_func_with_timing(*args, **kwargs):
            start_time = time.time()

            ret = func(*args, **kwargs)

            duration = (time.time() - start_time) * 1000
            statsd.timing(bucket, duration)

            return ret

        return proxy_func_with_timing

    return decorator


def api_method(func):
    """
    Designate this endpoint function as an API method. If secure frontend requests are enabled, this
    decorator will invalidate any incoming SPA tokens and assign a new SPA token as a response
    cookie. Incoming SPA tokens are invalidated in the cache with a short, asynchronous delay (to
    alleviate race conditions from concurrent client requests), and new SPA tokens are synchronously
    inserted into the cache before returning to the client. The logic of the underlying endpoint
    function is otherwise passed through transparently.

    This decorator should be used as a top-level wrapper of an endpoint function:

      @app.route('/', methods=['POST'])
      @require_form_args()
      @api_method
      def view_function():
          pass

    :param func: The wrapped API endpoint function.
    """
    def async_delete_token(spa_token):
        """
        Asynchronously delete the specified SPA token from the cache, after a small delay. This is
        a noop if the token does not currently exist in the cache.

        :param spa_token: The SPA token to invalidate.
        """
        def task():
            time.sleep(5)
            cache.delete(util.cache.format_key(util.cache.TAG_SPA_TOKEN, spa_token))

        thread = threading.Thread(target=task, args=())
        thread.daemon = True
        thread.start()

    @wraps(func)
    def decorator(*args, **kwargs):
        if not base_config.options.server('secure_frontend_requests'):
            return func(*args, **kwargs)

        # Asynchronously delete the incoming SPA token (assigned from a prior request)
        existing_spa_token = request.cookies.get(COOKIE_SPA_TOKEN)
        async_delete_token(existing_spa_token)

        # Generate a new, replacement SPA token
        new_spa_token = strgen.StringGenerator("[\d\p\w]{50}").render()

        # Transparently generate a response from the decorated API endpoint and attach the newly
        # created SPA token as a cookie
        resp = make_response(*func(*args, **kwargs))
        resp.set_cookie(COOKIE_SPA_TOKEN, new_spa_token)

        # To retain server-side state of this assigned token, synchronously add its value to the
        # local cache
        cache.set(
            name=util.cache.format_key(util.cache.TAG_SPA_TOKEN, new_spa_token),
            value=True,
            ex=6 * 60 * 60,  # Automated TTL of 6 hours
        )

        return resp

    return decorator


def require_form_args(form_args=tuple([]), allow_blank_values=False, strict_params=False):
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
                    status_code=400,
                    message='Required parameters are missing',
                    failure='failure_incomplete_params',
                    data={
                        'missing_params': list(set(form_args).difference(set(data.keys()))),
                    },
                )
            return func(data, *args, **kwargs)

        return abort_if_invalid_args

    return decorator


def require_login_api(admin_only=False, only_if=None):
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
      @require_login_api()
      def view_function():
          pass

    :param admin_only: True to only allow admin users to access this endpoint; False to allow any
                       authenticated user.
    :param only_if: Optional boolean parameter to denote that login is only required if the
                    expression is true in value.
    """
    def decorator(func):
        @wraps(func)
        def validate_auth(data, *args, **kwargs):
            # Allow access if the user is authenticated (or in the case of admin_only, only if the
            # user is also an admin).
            if current_user.is_authenticated and (not admin_only or current_user.is_admin):
                return func(data, *args, **kwargs)

            # If a condition is set, allow access if the condition is false in value.
            if only_if is not None and not only_if:
                return func(data, *args, **kwargs)

            api_key = request.headers.get('X-Linkr-Key') or data.get('api_key')
            if not api_key:
                return util.response.error(
                    status_code=403,
                    message='You must be authenticated to access this endpoint.',
                    failure='failure_unauth',
                )

            user = database.user.get_user_by_api_key(api_key)
            if user and (not admin_only or user.is_admin):
                # Log the user in before servicing the request, passing along the input data to
                # the API endpoint, excluding sensitive information (API key).
                login_user(user)
                if data.get('api_key'):
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

        api_key = request.headers.get('X-Linkr-Key') or data.get('api_key')
        if api_key:
            user = database.user.get_user_by_api_key(api_key)
            if user:
                login_user(user)
                if data.get('api_key'):
                    del data['api_key']

        return func(data, *args, **kwargs)

    return decorator


def require_frontend_api(func):
    """
    Require this API endpoint to be requested from a browser. The request should pass an SPA token
    as a cookie assigned from a previous request. The request should also supply a User-Agent header
    consistent with a browser. Refusing to supply an SPA token or supplying a stale token will cause
    the request to be rejected.

    This decorator should be used in conjunction with @api_method. This specifies an API endpoint
    function that should both invalidate and assign SPA tokens, and reject requests if an incoming
    token was not previously assigned by an @api_method function.

      @app.route('/', methods=['POST'])
      @require_form_args()
      @require_frontend_api
      @api_method
      def view_function():
          pass

    :param func: The wrapped API endpoint function.
    """
    @wraps(func)
    def decorator(data, *args, **kwargs):
        if not base_config.options.server('secure_frontend_requests'):
            return func(data, *args, **kwargs)

        spa_token = request.cookies.get(COOKIE_SPA_TOKEN)

        if not cache.get(util.cache.format_key(util.cache.TAG_SPA_TOKEN, spa_token)):
            return util.response.error(
                status_code=403,
                message='Client context requirements not fulfilled.',
                failure='failure_bad_client',
            )

        return func(data, *args, **kwargs)

    return decorator
