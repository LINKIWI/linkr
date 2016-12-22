import time

import util.cryptography
from linkr import db


class Link(db.Model):
    __tablename__ = 'link'

    link_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submit_time = db.Column(db.Integer)
    hits = db.Column(db.Integer, default=0)
    password_hash = db.Column(db.Text, default=None)
    alias = db.Column(db.String(32), index=True, unique=True)
    outgoing_url = db.Column(db.Text)

    def __init__(
        self,
        alias,
        outgoing_url,
        password=None,
    ):
        self.submit_time = int(time.time())
        self.alias = alias
        self.outgoing_url = outgoing_url
        self.password_hash = util.cryptography.secure_hash(password) if password else None

    def increment_hits(self):
        self.hits += 1

    def validate_password(self, password):
        return not self.password_hash or \
            util.cryptography.secure_hash(password) == self.password_hash

    def as_dict(self):
        return {
            'link_id': self.link_id,
            'submit_time': self.submit_time,
            'hits': self.hits,
            'alias': self.alias,
            'outgoing_url': self.outgoing_url,
        }
