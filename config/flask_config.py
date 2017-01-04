# flake8: noqa: E501

import config.options


# Flask-SQLAlchemy
SQLALCHEMY_DATABASE_URI = 'mysql://{database_user}:{database_password}@{database_host}/{database_name}'.format(
    database_user=config.options.DATABASE_USER,
    database_password=config.options.DATABASE_PASSWORD,
    database_host=config.options.DATABASE_HOST,
    database_name=config.options.DATABASE_NAME,
)
SQLALCHEMY_TEST_DATABASE_URI = 'mysql://{database_user}:{database_password}@{database_host}/{database_name}'.format(
    database_user=config.options.DATABASE_USER,
    database_password=config.options.DATABASE_PASSWORD,
    database_host=config.options.DATABASE_HOST,
    database_name=config.options.DATABASE_NAME + '_test',
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask session cookie name
SESSION_COOKIE_NAME = 'linkr-session'

# Flask session secret key
SECRET_KEY = '\xec5\xea\xc9\x9f,o\xd7v\xac\x06\xe2\xeeK2\xb9\x1d\x8a\xdel\xb27\x8a\xa8>\x07\n\xd4Z\xfeO\xa1'
