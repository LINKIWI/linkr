import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

template_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend/templates')
static_directory = 'frontend/static'

app = Flask(__name__, template_folder=template_directory, static_folder=static_directory)
app.config.from_object('config.flask_config')
db = SQLAlchemy(app, session_options={
    'expire_on_commit': False,
})
session = db.session

import models
from views import *


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
