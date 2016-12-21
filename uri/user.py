from base_uri import URI


class UserRegistrationURI(URI):
    methods = ['GET']
    path = URI.view_uri('/register')


class AddUserURI(URI):
    methods = ['PUT']
    path = URI.api_uri('/user/add')
