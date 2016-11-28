import os


# Flask-SQLAlchemy
SQLALCHEMY_DATABASE_URI = 'sqlite:///linkr.db'
SQLALCHEMY_DATABASE_TEST_URI = 'sqlite:///linkr.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask session secret key
SECRET_KEY = os.urandom(32)
