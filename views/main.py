from flask import redirect
from flask import render_template
from flask import request

import database.link
from linkr import app
from uri.link import *
from uri.main import *


@app.route(LinkAliasRedirectURI.path, methods=LinkAliasRedirectURI.methods)
def alias_route(alias):
    # Attempt to fetch the link mapping from the database
    link = database.link.get_link_by_alias(alias)

    if not link:
        if request.method == 'GET':
            # For GET requests (likely from a browser), direct to the frontend interface
            return render_template('index.html')
        elif request.method == 'POST':
            # For POST requests (likely programmatic), send a plain-text response with an
            # appropriate status code
            return 'Link alias not found', 404

    # Redirect to the frontend interface to handle authentication for password-protected links
    if link.password_hash:
        return render_template('index.html')

    link.increment_hits()

    return redirect(link.outgoing_url)


@app.route(HomeURI.path, defaults={'path': ''}, methods=HomeURI.methods)
@app.route(DefaultURI.path, methods=DefaultURI.methods)
def frontend(path):
    return render_template('index.html')
