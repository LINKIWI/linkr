import config
import util.response
from linkr import app
from uri.misc import *
from util.decorators import *


@app.route(ConfigURI.path, methods=ConfigURI.methods)
@require_form_args()
@require_login_api(admin_only=True)
def api_config(data):
    """
    Retrieve the current application configuration options.
    """
    try:
        return util.response.success({
            'config': {
                'options': dict(config.options.client, **config.options.server),
                'secrets': dict(config.secrets.client, **config.secrets.server),
            },
        })
    except:
        return util.response.undefined_error()
