import time

import config.options
import util.cryptography
from linkr import db


class Link(db.Model):
    __tablename__ = 'link'

    link_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, index=True, default=None)
    submit_time = db.Column(db.Integer)
    password_hash = db.Column(db.Text, default=None)
    alias = db.Column(db.String(32), index=True, unique=True)
    outgoing_url = db.Column(db.Text)

    def __init__(
        self,
        alias,
        outgoing_url,
        password=None,
        user_id=None,
    ):
        self.submit_time = int(time.time())
        self.alias = alias
        self.outgoing_url = outgoing_url
        self.password_hash = util.cryptography.secure_hash(password) if password else None
        self.user_id = user_id

    def validate_password(self, password):
        return not self.password_hash or \
            util.cryptography.secure_hash(password) == self.password_hash

    def as_dict(self):
        return {
            'link_id': self.link_id,
            'user_id': self.user_id,
            'submit_time': self.submit_time,
            'alias': self.alias,
            'full_alias': '{base}/{alias}'.format(base=config.options.LINKR_URL, alias=self.alias),
            'outgoing_url': self.outgoing_url,
            'is_password_protected': bool(self.password_hash),
        }
