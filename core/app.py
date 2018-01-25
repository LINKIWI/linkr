import os

import redis
import statsd
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from raven.contrib.flask import Sentry

import config

template_directory = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '../frontend/templates'
)
static_directory = '../frontend/static'

app = Flask(__name__, template_folder=template_directory, static_folder=static_directory)
app.config.from_object('config.flask')


def init_db():
    """
    Initialize the SQLAlchemy database object.

    :return: A SQLAlchemy instance used universally for database operations.
    """
    return SQLAlchemy(app, session_options={
        'expire_on_commit': False,
    })


def init_cache():
    return redis.StrictRedis(
        host=config.secrets.server('redis.host'),
        port=config.secrets.server('redis.port'),
        db=0,
        password=config.secrets.server('redis.password'),
    )


def init_login_manager():
    """
    Initialize the login manager.

    :return: A LoginManager instance used universally for flask-login loaders.
    """
    login_manager = LoginManager()
    login_manager.init_app(app)
    return login_manager


def init_sentry():
    """
    Initialize the Sentry client.

    :return: A Sentry instance used universally for capturing uncaught exceptions.
    """
    sentry = Sentry(dsn=config.secrets.server('sentry_server_dsn'))
    sentry.init_app(app)
    return sentry


def init_statsd():
    """
    Initialize the statsd client.
    """
    statsd.init_statsd({
        'STATSD_HOST': config.secrets.server('statsd.host'),
        'STATSD_PORT': config.secrets.server('statsd.port'),
        'STATSD_BUCKET_PREFIX': 'linkr',
    })
