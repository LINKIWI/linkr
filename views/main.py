from flask import render_template
from flask import redirect

from linkr import app
from database import db_txn

import database.link


@app.route('/<alias>', methods=['GET', 'POST'])
@db_txn
def alias_route(alias):
    link = database.link.get_link_by_alias(alias)
    if not link:
        return 'No such alias'
    link.increment_hits()
    return redirect(link.outgoing_url)


@app.route('/', methods=['GET'])
def frontend():
    return render_template('index.html')
