from linkr import db


def create_tables():
    """
    Create all database tables.
    """
    db.create_all()
