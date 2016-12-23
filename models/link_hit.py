import time

from linkr import db


class LinkHit(db.Model):
    __tablename__ = 'link_hit'

    hit_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    link_id = db.Column(db.Integer, index=True)
    timestamp = db.Column(db.Integer)
    remote_ip = db.Column(db.String(20))
    referer = db.Column(db.Text)
    user_agent = db.Column(db.Text)

    def __init__(
        self,
        link_id,
        remote_ip,
        referer,
        user_agent,
    ):
        self.link_id = link_id
        self.timestamp = int(time.time())
        self.remote_ip = remote_ip
        self.referer = referer
        self.user_agent = user_agent

    def as_dict(self):
        return {
            'hit_id': self.hit_id,
            'link_id': self.link_id,
            'timestamp': self.timestamp,
            'remote_ip': self.remote_ip,
            'referer': self.referer,
            'user_agent': self.user_agent,
        }
