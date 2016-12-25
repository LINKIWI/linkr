from flask_login import current_user

import database.link
import util.response
from linkr import app
from uri.link import *
from util.decorators import *
from util.exception import *


@app.route(LinkDetailsURI.path, methods=LinkDetailsURI.methods)
@require_form_args([])
def api_link_details(data):
    """
    Retrieve details for a particular alias.
    """
    try:
        # Prioritize retrieval by ID
        if data.get('link_id'):
            link_details = database.link.get_link_by_id(data['link_id'])
        elif data.get('alias'):
            link_details = database.link.get_link_by_alias(data['alias'])
        else:
            return util.response.error(
                400,
                'A link_id or alias must be supplied to retrieve link details.',
                'failure_incomplete_params',
            )

        if not link_details:
            return util.response.error(
                404,
                'The requested link alias does not exist.',
                'failure_nonexistent_alias',
            )

        # If the link is password-protected, it's necessary to check that the link password is both
        # included as a request parameter and is correct before serving the details to the client.
        # The admin account is allowed to bypass the password protection check.
        should_deny_access = all([
            not link_details.validate_password(data.get('password', '')),
            not current_user.is_authenticated or not current_user.is_admin,
        ])
        if should_deny_access:
            return util.response.error(
                401,
                'The supplied link password is incorrect.',
                'failure_incorrect_link_password',
            )

        if data.get('increment_hits'):
            database.link.add_link_hit(
                link_id=link_details.link_id,
                remote_ip=request.remote_addr,
                referer=request.referrer,
                user_agent=request.user_agent,
            )

        return util.response.success({
            'details': link_details.as_dict()
        })
    except:
        return util.response.undefined_error()


@app.route(LinkAddURI.path, methods=LinkAddURI.methods)
@require_form_args(['alias', 'outgoing_url'])
def api_add_link(data):
    """
    Add a new link (alias <-> outgoing URL association).
    """
    try:
        new_link = database.link.add_link(
            alias=data['alias'],
            outgoing_url=data['outgoing_url'],
            password=data.get('password'),
            user_id=current_user.user_id if current_user.is_authenticated else None
        )
        return util.response.success({
            'alias': new_link.alias,
            'outgoing_url': new_link.outgoing_url,
        })
    except InvalidAliasException:
        return util.response.error(
            400,
            'The requested alias is invalid; it is not URL-safe or is too long.',
            'failure_invalid_alias',
        )
    except InvalidURLException:
        return util.response.error(
            400,
            'The requested URL is invalid.',
            'failure_invalid_url',
        )
    except UnavailableAliasException:
        return util.response.error(
            409,
            'The requested alias is already taken.',
            'failure_unavailable_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkDeleteURI.path, methods=LinkDeleteURI.methods)
@require_form_args(['alias'])
def api_delete_link(data):
    """
    Delete an existing link.
    """
    try:
        database.link.delete_link(data['alias'])
        return util.response.success({
            'alias': data['alias'],
        })
    except InvalidAliasException:
        return util.response.error(
            404,
            'The requested alias does not exist.',
            'failure_nonexistent_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkHitsURI.path, methods=LinkHitsURI.methods)
@require_form_args(['link_id'])
def api_link_hits(data):
    """
    Retrieve a paginated list of hits for a particular link.
    """
    # Only the admin user is allowed to access this endpoint.
    if not current_user.is_authenticated or not current_user.is_admin:
        return util.response.error(
            status_code=403,
            message='Only the admin user is allowed to access this endpoint.',
            failure='failure_unauth',
        )

    expect_args = {'link_id', 'page_num', 'num_per_page'}
    filtered_data = {
        key: value
        for key, value in data.items()
        if key in expect_args
    }

    try:
        hits = database.link.get_link_hits_by_id(**filtered_data)
        return util.response.success({
            'hits': [hit.as_dict() for hit in hits]
        })
    except:
        return util.response.undefined_error()


@app.route(LinksForUserURI.path, methods=LinksForUserURI.methods)
@require_form_args([])
def api_links_for_user(data):
    """
    Retrieve all links for a user. If a user_id is specified, results are always returned if the
    user ID agrees with the currently logged in user's ID, or if the currently logged in user is an
    admin. If no user_id is specified, links for the currently logged in user are returned.
    """
    try:
        user_id = data.get('user_id', current_user.user_id)

        if user_id == current_user.user_id or current_user.is_admin:
            return util.response.success({
                'links': database.link.get_links_for_user(user_id),
            })

        return util.response.error(
            status_code=403,
            message='',
            failure='failure_unauth',
        )
    except:
        return util.response.undefined_error()
