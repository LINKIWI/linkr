from base_uri import URI


class HomeURI(URI):
    methods = ['GET']
    path = '/'


class DefaultURI(URI):
    methods = ['GET']
    path = '/<path:path>'


class AdminURI(URI):
    methods = ['GET']
    path = '/linkr/admin'


class APIDocumentationURI(URI):
    methods = ['GET']
    path = '/linkr/api'
