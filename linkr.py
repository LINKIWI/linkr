import core.app

app = core.app.app
db = core.app.init_db()
cache = core.app.init_cache()
login_manager = core.app.init_login_manager()
sentry = core.app.init_sentry()
core.app.init_statsd()

import models
from views import *

warm_template_cache(app)


if __name__ == '__main__':
    app.run(  # pragma: no cover
        host='0.0.0.0',
        threaded=True,
        debug=True,
        extra_files=[
            'frontend/static/dist/bundle.js',
            'frontend/static/dist/main.css',
            'frontend/templates/index.html',
        ],
    )
