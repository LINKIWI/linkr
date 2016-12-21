# flake8: noqa: E501

import os

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

# Flask session secret key
SECRET_KEY = os.urandom(32)
