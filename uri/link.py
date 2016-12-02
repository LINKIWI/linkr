from base_uri import URI


class LinkAddURI(URI):
    methods = ['PUT']
    path = '/linkr/api/link/add'


class LinkDeleteURI(URI):
    methods = ['DELETE']
    path = '/linkr/api/link/delete'


class LinkAliasRedirectURI(URI):
    methods = ['GET', 'POST']
    path = '/<alias>'


class LinkNotFoundURI(URI):
    methods = ['GET']
    path = '/linkr/not-found'
