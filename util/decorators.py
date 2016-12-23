from functools import wraps

from flask import request

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
