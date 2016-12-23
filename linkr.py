import core.app

app = core.app.app
db = core.app.init_db()
login_manager = core.app.init_login_manager()

import models
from views import *


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
