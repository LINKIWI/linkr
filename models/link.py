import time

import config
import util.cryptography
from linkr import db


class Link(db.Model):
    """
    Model representing a link entry.
    """

    __tablename__ = 'link'

    link_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, index=True, default=None)
    submit_time = db.Column(db.Integer)
    alias = db.Column(db.String(32), index=True, unique=True)
    outgoing_url = db.Column(db.Text)
    password_hash = db.Column(db.Text, default=None)
    require_recaptcha = db.Column(db.Boolean, default=False)

    def __init__(
        self,
        alias,
        outgoing_url,
        password=None,
        user_id=None,
        require_recaptcha=False,
    ):
        """
        Create a new link entry.

        :param alias: The alias for the link.
        :param outgoing_url: The fully qualified outgoing URL for the link.
        :param password: An optional password to associate with the link.
        :param user_id: An optional user ID to associate with the link.
        """
        self.submit_time = int(time.time())
        self.alias = alias
        self.outgoing_url = outgoing_url
        self.password_hash = util.cryptography.secure_hash(password) if password else None
        self.user_id = user_id
        self.require_recaptcha = require_recaptcha

    def edit(self, alias=None, outgoing_url=None):
        """
        Edit this link's alias or outgoing URL. All input fields are optional; if an input has a
        falsey value, its value will not be changed.

        :param alias: The new alias.
        :param outgoing_url: The new outgoing URL.
        """
        if alias:
            self.alias = alias
        if outgoing_url:
            self.outgoing_url = outgoing_url

    def update_password(self, password):
        """
        Update the password for this link. To remove this link's password, the password must be
        explicitly passed in as a falsey value.

        :param password: The new plain-text password, or None.
        """
        self.password_hash = util.cryptography.secure_hash(password) if password else None

    def validate_password(self, password):
        """
        Validate that the supplied link password is correct for this link. This method will
        consider any password to be "correct" if there is no password associated with this link.

        :param password: The supplied password.
        :return: True if the supplied password matches the link's password or if the link is not
                 password protected; False otherwise.
        """
        return not self.is_password_protected() or \
            util.cryptography.secure_hash(password) == self.password_hash

    def as_dict(self):
        """
        Represent this link entry as a API-friendly, JSON-formatted dictionary.

        :return: A representation of this link's data as a dictionary.
        """
        return {
            'link_id': self.link_id,
            'user_id': self.user_id,
            'submit_time': self.submit_time,
            'alias': self.alias,
            'full_alias': '{base}/{alias}'.format(
                base=config.options.server['linkr_url'],
                alias=self.alias,
            ),
            'outgoing_url': self.outgoing_url,
            'is_password_protected': self.is_password_protected(),
            'require_recaptcha': self.require_recaptcha,
        }

    def is_password_protected(self):
        """
        Return whether this link is password protected.

        :return: True if the link is password protected; False otherwise.
        """
        return bool(self.password_hash)
