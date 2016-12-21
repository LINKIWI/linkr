from base_uri import URI


class LinkAliasRedirectURI(URI):
    methods = ['GET', 'POST']
    path = '/<alias>'


class LinkNotFoundURI(URI):
    methods = ['GET']
    path = URI.view_uri('/not-found')


class LinkDetailsURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/details')


class LinkAddURI(URI):
    methods = ['PUT']
    path = URI.api_uri('/link/add')


class LinkDeleteURI(URI):
    methods = ['DELETE']
    path = URI.api_uri('/link/delete')
