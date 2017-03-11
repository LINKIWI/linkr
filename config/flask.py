# flake8: noqa: E501

import config


# Flask-SQLAlchemy
SQLALCHEMY_DATABASE_URI = 'mysql://{database_user}:{database_password}@{database_host}/{database_name}'.format(
    database_user=config.secrets.server['database']['user'],
    database_password=config.secrets.server['database']['password'],
    database_host=config.secrets.server['database']['host'],
    database_name=config.secrets.server['database']['name'],
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask session cookie name
SESSION_COOKIE_NAME = 'linkr-session'

# Flask session secret key
SECRET_KEY = '\xec5\xea\xc9\x9f,o\xd7v\xac\x06\xe2\xeeK2\xb9\x1d\x8a\xdel\xb27\x8a\xa8>\x07\n\xd4Z\xfeO\xa1'
