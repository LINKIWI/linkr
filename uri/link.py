from base_uri import URI


class LinkAliasRedirectURI(URI):
    methods = ['GET', 'POST']
    path = '/<alias>'


class LinkAliasURI(URI):
    methods = ['GET']
    path = '/:alias'


class LinkShortenSuccessURI(URI):
    methods = ['GET']
    path = URI.view_uri('/success/:alias')


class LinkDetailsURI(URI):
    is_public = True
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/details')


class LinkAliasSearchURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/search')


class LinkAddURI(URI):
    is_public = True
    methods = ['PUT']
    path = URI.api_uri('/link/add')


class LinkEditURI(URI):
    is_public = True
    methods = ['POST']
    path = URI.api_uri('/link/edit')


class LinkUpdatePasswordURI(URI):
    methods = ['POST']
    path = URI.api_uri('/link/update-password')


class LinkDeleteURI(URI):
    is_public = True
    methods = ['DELETE']
    path = URI.api_uri('/link/delete')


class LinkHitsURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/hits')


class LinksForUserURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/list-for-user')


class RecentLinksURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/recent')


class LinkIncrementHitsURI(URI):
    methods = ['POST']
    path = URI.api_uri('/link/increment-hits')


class LinkPreviewURI(URI):
    is_public = True
    methods = ['GET', 'POST']
    path = URI.api_uri('/link/preview')
