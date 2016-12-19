from base_uri import URI


class AuthLoginURI(URI):
    methods = ['POST']
    path = '/linkr/api/auth/login'


class AuthLogoutURI(URI):
    methods = ['GET', 'POST']
    path = '/linkr/api/auth/logout'
