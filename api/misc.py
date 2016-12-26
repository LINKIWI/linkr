import config.options
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
        config_opts = {
            opt: getattr(config.options, opt)
            for opt in dir(config.options)
            if not opt.startswith('__')
        }
        return util.response.success({
            'config': config_opts,
        })
    except:
        return util.response.undefined_error()
