import flask


def success(data={}, status_code=200):
    """
    Factory method for creating a successful Flask response.

    :param data: JSON data to package with the response.
    :param status_code: Optional HTTP status code.
    :return: A tuple of (response object, status code) with the input data represented.
    """
    template = {
        'success': True,
        'message': None,
    }
    resp_data = dict(template, **data)

    return flask.jsonify(resp_data), status_code


def error(status_code, message, failure, data={}):
    """
    Factory method for creating an error Flask response.

    :param status_code: The HTTP status code to associate with the response.
    :param message: A string describing the error.
    :param failure: A string describing the failure name/code; frontend logic checks this value as a
                    string.
    :param data: JSON data to package with the response.
    :return: A tuple of (response object, status code) with the input data represented.
    """
    template = {
        'success': False,
        'message': message,
        'failure': failure,
    }
    resp_data = dict(template, **data)

    return flask.jsonify(resp_data), status_code


def undefined_error():
    """
    Factory method for creating an undefined error.

    :return: A tuple of (response object, status code) describing an undefined error.
    """
    return flask.jsonify({
        'success': False,
        'message': 'There was an undefined server-side failure. This is probably a bug.',
        'failure': 'failure_undefined',
    }), 500
