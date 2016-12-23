from base_uri import URI


class HomeURI(URI):
    methods = ['GET']
    path = '/'


class DefaultURI(URI):
    methods = ['GET']
    path = '/<path:path>'


class AdminURI(URI):
    methods = ['GET']
    path = URI.view_uri('/admin')


class AdminLinkDetailsURI(URI):
    methods = ['GET']
    path = URI.view_uri('/admin/link/:link_id')


class APIDocumentationURI(URI):
    methods = ['GET']
    path = URI.view_uri('/api')
