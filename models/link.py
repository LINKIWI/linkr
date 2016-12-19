import time

from linkr import db


class Link(db.Model):
    __tablename__ = 'link'

    link_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submit_time = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    hits = db.Column(db.Integer, default=0)
    is_public = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.Text, default=None)
    alias = db.Column(db.Text(length=32), index=True, unique=True)
    outgoing_url = db.Column(db.Text)

    def __init__(
        self,
        alias,
        outgoing_url,
        is_public=True,
        password_hash=None,
    ):
        self.submit_time = int(time.time())
        self.alias = alias
        self.outgoing_url = outgoing_url
        self.is_public = is_public
        self.password_hash = password_hash

    def deactivate(self):
        self.is_active = False

    def increment_hits(self):
        self.hits += 1
