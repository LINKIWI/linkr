from base_uri import URI


class LoginURI(URI):
    methods = ['GET']
    path = URI.view_uri('/login')


class AuthCheckURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/auth/check')


class AuthLoginURI(URI):
    methods = ['POST']
    path = URI.api_uri('/auth/login')


class AuthLogoutURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/auth/logout')
