# flake8: noqa: F401

# Templating utils
from util.templating import *

# Page view functions
from main import *

# API view functions
from api import *


def warm_template_cache(app):
    """
    Warm the template cache by initially rendering all view endpoints with templates. Every new
    incoming request from a client will receive a cached copy of the template.
    """
    # Mock a request context so that the template can be rendered without a request context.
    # All template rendering logic is stateless, so a fake request context has no negative impact
    # on the cached template string.
    with app.test_request_context():
        frontend()
