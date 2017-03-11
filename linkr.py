import core.app

app = core.app.app
db = core.app.init_db()
login_manager = core.app.init_login_manager()
sentry = core.app.init_sentry()

import models
from views import *

warm_template_cache(app)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        threaded=True,
        debug=True,
        extra_files=[
            'frontend/static/dist/bundle.js',
            'frontend/static/dist/main.css',
            'frontend/templates/index.html',
        ],
    )
