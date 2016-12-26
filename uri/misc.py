from base_uri import URI


class ConfigURI(URI):
    methods = ['GET', 'POST']
    path = URI.api_uri('/config')
