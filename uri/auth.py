from base_uri import URI


class LoginURI(URI):
    methods = ['GET']
    path = '/linkr/login'


class AuthCheckURI(URI):
    methods = ['GET', 'POST']
    path = '/linkr/api/auth/check'


class AuthLoginURI(URI):
    methods = ['POST']
    path = '/linkr/api/auth/login'


class AuthLogoutURI(URI):
    methods = ['GET', 'POST']
    path = '/linkr/api/auth/logout'
