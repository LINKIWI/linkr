from flask import redirect
from flask import render_template
from flask import request

import database.link
import util.response
from linkr import app
from uri.link import *
from uri.main import *
from util.decorators import require_form_args


@app.route(LinkAliasRedirectURI.path, methods=LinkAliasRedirectURI.methods)
@require_form_args([])
def alias_route(data, alias):
    """
    Server-side link alias processing. For GET requests, will respond with a 302 redirect to the
    outgoing URL, or serve the frontend if some user intervention is required (e.g. entering a
    password). Programmatic POST requests are served a JSON error similar to that of
    api_link_details.
    """
    # Attempt to fetch the link mapping from the database
    link = database.link.get_link_by_alias(alias)

    if not link:
        if request.method == 'GET':
            # For GET requests (likely from a browser), direct to the frontend interface
            return render_template('index.html')
        elif request.method == 'POST':
            # For POST requests (likely programmatic), send a JSON response with an appropriate
            # status code
            return util.response.error(
                status_code=404,
                message='The requested link alias does not exist.',
                failure='failure_nonexistent_alias',
            )

    # Redirect to the frontend interface to handle authentication for password-protected links
    if link.password_hash and not link.validate_password(data.get('password', '')):
        if request.method == 'GET':
            return render_template('index.html')
        elif request.method == 'POST':
            return util.response.error(
                status_code=401,
                message='The supplied link password is incorrect.',
                failure='failure_incorrect_link_password',
            )

    database.link.add_link_hit(
        link_id=link.link_id,
        remote_ip=request.remote_addr,
        referer=request.referrer,
        user_agent=request.user_agent,
    )

    return redirect(link.outgoing_url)


@app.route(HomeURI.path, defaults={'path': ''}, methods=HomeURI.methods)
@app.route(DefaultURI.path, methods=DefaultURI.methods)
def frontend(path):
    """
    Serve the frontend application. All rendering logic is handled client-side.
    """
    return render_template('index.html')
