from webpreview import web_preview

import config.options
import database.link
import util.response
from linkr import app
from uri.link import *
from util.decorators import *
from util.exception import *


@app.route(LinkDetailsURI.path, methods=LinkDetailsURI.methods)
@require_form_args()
@optional_login_api
def api_link_details(data):
    """
    Retrieve details for a particular link by ID or alias.
    """
    try:
        # Prioritize retrieval by ID
        link = database.link.get_link_by_id(data.get('link_id')) or \
            database.link.get_link_by_alias(data.get('alias'))
        if not link:
            raise NonexistentLinkException

        # If the link is password-protected, it's necessary to check that the link password is both
        # included as a request parameter and is correct before serving the details to the client.
        validate_link_password(link.link_id, data.get('password'))

        return util.response.success({
            'details': link.as_dict(),
        })
    except NonexistentLinkException:
        return util.response.error(
            status_code=404,
            message='No link exists with the provided ID or alias, or no `link_id` or `alias` '
                    'parameter was provided in the request.',
            failure='failure_nonexistent_link',
        )
    except InvalidAuthenticationException:
        return util.response.error(
            status_code=401,
            message='The supplied link password is incorrect.',
            failure='failure_incorrect_link_password',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkIncrementHitsURI.path, methods=LinkIncrementHitsURI.methods)
@require_form_args(['link_id'])
@optional_login_api
def api_increment_link_hits(data):
    """
    Increment the number of hits for a particular link.
    """
    try:
        # The client should only be able to increment the number of hits on a password-protected
        # link if the password is both supplied and valid.
        validate_link_password(data['link_id'], data.get('password'))

        hit = database.link.add_link_hit(
            link_id=data['link_id'],
            remote_ip=request.remote_addr,
            referer=request.referrer,
            user_agent=request.user_agent,
        )

        return util.response.success({
            'hit': hit.as_dict(),
        })
    except NonexistentLinkException:
        return util.response.error(
            status_code=404,
            message='The link ID associated with this hit does not exist.',
            failure='failure_nonexistent_link',
        )
    except InvalidAuthenticationException:
        return util.response.error(
            status_code=401,
            message='The supplied link password is incorrect.',
            failure='failure_incorrect_link_password',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkAddURI.path, methods=LinkAddURI.methods)
@require_form_args(['alias', 'outgoing_url'])
@require_login_api(only_if=config.options.REQUIRE_LOGIN_TO_CREATE)
@optional_login_api
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
            status_code=400,
            message='The requested alias is invalid; it is not URL-safe or is too long.',
            failure='failure_invalid_alias',
        )
    except ReservedAliasException:
        return util.response.error(
            status_code=404,
            message='The requested alias is reserved, and cannot be used. Use a different alias.',
            failure='failure_reserved_alias',
        )
    except InvalidURLException:
        return util.response.error(
            status_code=400,
            message='The requested URL is invalid.',
            failure='failure_invalid_url',
        )
    except UnavailableAliasException:
        return util.response.error(
            status_code=409,
            message='The requested alias is already taken.',
            failure='failure_unavailable_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkEditURI.path, methods=LinkEditURI.methods)
@require_form_args(['link_id', 'alias', 'outgoing_url'], allow_blank_values=True)
@require_login_api()
def api_edit_link(data):
    """
    Edit an existing link's details.
    """
    try:
        validate_link_ownership(data['link_id'])

        modified_link = database.link.edit_link(
            link_id=data['link_id'],
            alias=data['alias'],
            outgoing_url=data['outgoing_url'],
        )
        return util.response.success({
            'alias': modified_link.alias,
            'outgoing_url': modified_link.outgoing_url,
        })
    except NonexistentLinkException:
        return util.response.error(
            status_code=404,
            message='The requested link alias does not exist.',
            failure='failure_nonexistent_link',
        )
    except UnauthorizedException:
        return util.response.error(
            status_code=403,
            message='You may only edit the link details for links created by you.',
            failure='failure_unauth',
        )
    except InvalidAliasException:
        return util.response.error(
            status_code=400,
            message='The requested alias is invalid; it is not URL-safe or is too long.',
            failure='failure_invalid_alias',
        )
    except InvalidURLException:
        return util.response.error(
            status_code=400,
            message='The requested URL is invalid.',
            failure='failure_invalid_url',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkUpdatePasswordURI.path, methods=LinkUpdatePasswordURI.methods)
@require_form_args(['link_id', 'password'], allow_blank_values=True)
@require_login_api()
def api_update_link_password(data):
    """
    Update or remove the password of an existing link.
    """
    try:
        validate_link_ownership(data['link_id'])

        modified_link = database.link.update_link_password(
            link_id=data['link_id'],
            password=data['password'],
        )
        return util.response.success({
            'link_id': modified_link.link_id,
        })
    except NonexistentLinkException:
        return util.response.error(
            status_code=404,
            message='The requested link alias does not exist.',
            failure='failure_nonexistent_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkDeleteURI.path, methods=LinkDeleteURI.methods)
@require_form_args(['link_id'])
@require_login_api()
def api_delete_link(data):
    """
    Delete an existing link.
    """
    try:
        validate_link_ownership(data['link_id'])

        database.link.delete_link(data['link_id'])
        return util.response.success({
            'link_id': data['link_id'],
        })
    except NonexistentLinkException:
        return util.response.error(
            404,
            'The requested alias does not exist.',
            'failure_nonexistent_alias',
        )
    except:
        return util.response.undefined_error()


@app.route(LinkHitsURI.path, methods=LinkHitsURI.methods)
@require_form_args(['link_id'])
@require_login_api(admin_only=True)
def api_link_hits(data):
    """
    Retrieve a paginated list of hits for a particular link.
    """
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
@require_form_args()
@require_login_api()
def api_links_for_user(data):
    """
    Retrieve all links for a user. If a user_id is specified, results are always returned if the
    user ID agrees with the currently logged in user's ID, or if the currently logged in user is an
    admin. If no user_id is specified, links for the currently logged in user are returned.
    """
    try:
        user_id = data.get('user_id', current_user.user_id)

        if user_id == current_user.user_id or current_user.is_admin:
            links = database.link.get_links_for_user(
                user_id=user_id,
                page_num=data.get('page_num'),
                num_per_page=data.get('num_per_page'),
            )
            return util.response.success({
                'links': [link.as_dict() for link in links],
            })

        return util.response.error(
            status_code=403,
            message='You may only view links created by yourself.',
            failure='failure_unauth',
        )
    except NonexistentUserException:
        return util.response.error(
            status_code=404,
            message='No user exists with the specified user ID.',
            failure='failure_nonexistent_user',
        )
    except:
        return util.response.undefined_error()


@app.route(RecentLinksURI.path, methods=RecentLinksURI.methods)
@require_form_args()
@require_login_api(admin_only=True)
def api_recent_links(data):
    """
    Retrieve a paginated list of all recently created links.
    """
    expect_args = {'page_num', 'num_per_page'}
    filtered_data = {
        key: value
        for key, value in data.items()
        if key in expect_args
    }

    try:
        links = database.link.get_recent_links(**filtered_data)
        return util.response.success({
            'links': [link.as_dict() for link in links]
        })
    except:
        return util.response.undefined_error()


@app.route(LinkPreviewURI.path, methods=LinkPreviewURI.methods)
@require_form_args(['link_id'])
@require_login_api()
def link_preview(data):
    """
    Preview the metadata of a link's outgoing URL.
    """
    try:
        link = validate_link_ownership(data['link_id'])

        title, description, image = web_preview(link.outgoing_url)

        return util.response.success({
            'link_id': link.link_id,
            'preview': {
                'title': title,
                'description': description,
                'image': image,
            },
        })
    except NonexistentLinkException:
        return util.response.error(
            status_code=404,
            message='The requested link ID does not exist.',
            failure='failure_nonexistent_link',
        )
    except UnauthorizedException:
        return util.response.error(
            status_code=403,
            message='You may only preview links created by you.',
            failure='failure_unauth',
        )
    except:
        return util.response.undefined_error()


def validate_link_password(link_id, password):
    """
    Validate the link password for a specified link ID. The request is considered to be authorized
    if (1) the link is not password-protected, (2) the link is password-protected and the supplied
    password is correct, or (3) the currently logged in user is an admin, who is allowed to bypass
    all link password authentication requests.

    :param link_id: ID of the link to check.
    :param password: The attempted password for this link.
    :return: The models.Link instance referenced by this check.
    :raises NonexistentLinkException: If the link does not exist.
    :raises InvalidAuthenticationException: If the supplied password is incorrect.
    """
    link = database.link.get_link_by_id(link_id)
    if not link:
        raise NonexistentLinkException('No link exists with link ID `{link_id}`'.format(
            link_id=link_id,
        ))

    is_admin = current_user.is_authenticated and current_user.is_admin
    is_owner = current_user.is_authenticated and link.user_id == current_user.user_id
    if not link.validate_password(password or '') and not is_admin and not is_owner:
        raise InvalidAuthenticationException('The supplied password is incorrect')

    return link


def validate_link_ownership(link_id):
    """
    Validate that the link is accessible by the user. The link is considered accessible if it is
    owned by the user, or the user is an admin.

    :param link_id: ID of the link to check.
    :return: The models.Link instance referenced by this check.
    :raises NonexistentLinkException: If the link does not exist.
    :raises UnauthorizedException: If the user is not allowed to access the link.
    """
    link = database.link.get_link_by_id(link_id)
    if not link:
        raise NonexistentLinkException('No link exists with link ID `{link_id}`'.format(
            link_id=link_id,
        ))

    if link.user_id != current_user.user_id and not current_user.is_admin:
        raise UnauthorizedException('The current user does not own link ID `{link_id}`'.format(
            link_id=link_id,
        ))

    return link
