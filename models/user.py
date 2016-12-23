import base64
import os
import re
import time

import util.cryptography
from linkr import db


def _generate_api_key():
    """
    TODO

    :return:
    """
    # Attempt to get a random alphanumeric string for an API key
    return re.sub('(\W\D)+', '', base64.b64encode(os.urandom(32)))


class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    is_admin = db.Column(db.Boolean)
    signup_time = db.Column(db.Integer)
    signup_ip = db.Column(db.Text)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.Text)
    api_key = db.Column(db.String(64), index=True)

    def __init__(
        self,
        username,
        password,
        signup_ip,
        is_admin=False,
    ):
        self.signup_time = int(time.time())
        self.signup_ip = signup_ip
        self.username = username
        self.password_hash = util.cryptography.secure_hash(password)
        self.generate_new_api_key()
        self.is_admin = is_admin

    def generate_new_api_key(self):
        """
        TODO

        :return:
        """
        self.api_key = _generate_api_key()

    @staticmethod
    def is_authenticated():
        return True

    def is_active(self):
        return self.is_active

    @staticmethod
    def is_anonymous():
        return False

    def get_id(self):
        return unicode(self.user_id)
