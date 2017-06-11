from base_uri import URI


class ConfigURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/config')


class VersionURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/version')
