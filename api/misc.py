import config
import util.response
from linkr import app
from uri.misc import *
from util.decorators import *


@app.route(ConfigURI.path, methods=ConfigURI.methods)
@require_form_args()
@require_login_api(admin_only=True)
@require_frontend_api
@api_method
def api_config(data):
    """
    Retrieve the current application configuration options.
    """
    options = {
        key: 'value'
        for key in dict(config.options.client, **config.options.server).keys()
    }
    secrets = {
        key: 'value'
        for key in dict(config.secrets.client, **config.secrets.server).keys()
    }

    try:
        return util.response.success({
            'config': {
                'options': options,
                'secrets': secrets,
            },
        })
    except:
        return util.response.undefined_error()
