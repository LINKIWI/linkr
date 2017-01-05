import time

from linkr import db


class LinkHit(db.Model):
    """
    Model representing an access to a link.
    """

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
        """
        Create a new link hit.

        :param link_id: The ID of the link.
        :param remote_ip: The IP address of the client.
        :param referer: The referer header string, if applicable.
        :param user_agent: The user-agent header string, if applicable.
        """
        self.link_id = link_id
        self.timestamp = int(time.time())
        self.remote_ip = remote_ip
        self.referer = referer
        self.user_agent = user_agent

    def as_dict(self):
        """
        Represent this link hit as a API-friendly, JSON-formatted dictionary.

        :return: A representation of this link hit's data as a dictionary.
        """
        return {
            'hit_id': self.hit_id,
            'link_id': self.link_id,
            'timestamp': self.timestamp,
            'remote_ip': self.remote_ip,
            'referer': self.referer,
            'user_agent': self.user_agent,
        }
