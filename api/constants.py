# TODO

# Result of call
RESULT = 'success'
RESULT_SUCCESS = True
RESULT_FAILURE = False
MESSAGE = 'message'
FAILURE = 'failure'
SUCCESS_CODE = 200


# Predefined JSON responses
AUTH_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'User needs to be authenticated to complete this request',
    FAILURE: 'auth_failure',
}
AUTH_FAILURE_CODE = 401

INCOMPLETE_PARAMS_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'Required parameters are missing',
    FAILURE: 'incomplete_params_failure',
}
INCOMPLETE_PARAMS_FAILURE_CODE = 400

NONEXISTENT_USER_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'User does not exist',
    FAILURE: 'nonexistent_user_failure',
}
NONEXISTENT_USER_FAILURE_CODE = 404

INVALID_ALIAS_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'Requested alias is invalid; it is not URL-safe. Remove all URL-unsafe characters.',
    FAILURE: 'invalid_alias_failure',
}
INVALID_ALIAS_FAILURE_CODE = 400

NONEXISTENT_ALIAS_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'Requested alias does not exist',
    FAILURE: 'nonexistent_alias_failure',
}
NONEXISTENT_ALIAS_FAILURE_CODE = 404

UNAVAILABLE_ALIAS_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'The requested alias is already taken',
    FAILURE: 'unavailable_alias_failure',
}
UNAVAILABLE_ALIAS_FAILURE_CODE = 409

INVALID_URL_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'Requested URL is invalid',
    FAILURE: 'invalid_url_failure',
}
INVALID_URL_FAILURE_CODE = 400

UNDEFINED_FAILURE = {
    RESULT: RESULT_FAILURE,
    MESSAGE: 'Undefined server-side failure',
    FAILURE: 'undefined_failure',
}
UNDEFINED_FAILURE_CODE = 500
