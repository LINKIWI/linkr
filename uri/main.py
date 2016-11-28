from base_uri import URI


class HomeURI(URI):
    path = '/'


class AliasRedirectURI(URI):
    path = '/<alias>'
