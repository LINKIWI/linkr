from base_uri import URI


class UserRegistrationURI(URI):
    methods = ['GET']
    path = URI.view_uri('/register')


class UserAccountURI(URI):
    methods = ['GET']
    path = URI.view_uri('/account')


class UserAccountLinkDetailsURI(URI):
    methods = ['GET']
    path = URI.view_uri('/account/link/:alias')


class UserAddURI(URI):
    methods = ['PUT']
    path = URI.api_uri('/user/add')


class UserDeactivationURI(URI):
    methods = ['DELETE']
    path = URI.api_uri('/user/delete')


class UserUpdatePasswordURI(URI):
    methods = ['POST']
    path = URI.api_uri('/user/update-password')


class UserRegenerateAPIKeyURI(URI):
    methods = ['POST']
    path = URI.api_uri('/user/regenerate-api-key')


class RecentUsersURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/user/recent')
