from base_uri import URI


class UserRegistrationURI(URI):
    methods = ['GET']
    path = URI.view_uri('/register')


class UserAccountURI(URI):
    methods = ['GET']
    path = URI.view_uri('/account')


class UserAddURI(URI):
    methods = ['PUT']
    path = URI.api_uri('/user/add')


class UserDeactivationURI(URI):
    methods = ['DELETE']
    path = URI.api_uri('/user/delete')
