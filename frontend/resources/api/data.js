/* eslint-disable camelcase */

import context from '../../app/util/context';

const AUTHENTICATION_REQUIRED = 'required';
const AUTHENTICATION_OPTIONAL = 'optional';
const AUTHENTICATION_NOT_REQUIRED = 'none';

const data = {
  endpoints: [
    {
      meta: {
        title: 'Create a new link',
        subtitle: 'Create a new anonymous or authorized link',
        description: 'Create a new link (association between an alias and an outgoing URL). The ' +
          'new link will be tied to your user account if you make an authenticated request to ' +
          'this endpoint.',
        authentication: AUTHENTICATION_OPTIONAL
      },
      endpoint: {
        method: 'PUT',
        uri: 'LinkAddURI',
        parameters: [
          {
            key: 'alias',
            type: 'string',
            description: 'The desired link alias.',
            example: 'alias',
            required: true
          },
          {
            key: 'outgoing_url',
            type: 'string',
            description: 'The URL to which this link should point.',
            example: 'https://google.com',
            required: true
          },
          {
            key: 'password',
            type: 'string',
            description: 'Plain-text link password, if this link should be password-protected. ' +
              'Omit or leave blank for a regular, non-password-protected link.',
            required: false
          }
        ],
        response: [
          {
            key: 'alias',
            type: 'string',
            description: 'The alias of the new link.',
            example: 'alias'
          },
          {
            key: 'outgoing_url',
            type: 'string',
            description: 'The outgoing URL of the new link.',
            example: 'https://google.com'
          }
        ],
        errors: [
          {
            failure: 'failure_invalid_alias',
            description: 'The requested alias is not URL-safe, is too long, or otherwise does ' +
              'not meet alias validity requirements.'
          },
          {
            failure: 'failure_reserved_alias',
            description: 'The requested alias is reserved by either the administrator or ' +
              'application itself and cannot be used.'
          },
          {
            failure: 'failure_invalid_url',
            description: 'The requested URL is not valid.'
          },
          {
            failure: 'failure_unavailable_alias',
            description: 'The alias is already taken.'
          }
        ]
      }
    },
    {
      meta: {
        title: 'View link details',
        subtitle: 'Retrieve metadata about an existing link',
        description: 'Retrieve information about a link, including its alias, outgoing URL, and ' +
          'other miscellaneous metadata. For password-protected links, you must either supply ' +
          'the link password, or authenticate the request as the user who created the link.',
        authentication: AUTHENTICATION_OPTIONAL
      },
      endpoint: {
        method: 'POST',
        uri: 'LinkDetailsURI',
        parameters: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The link ID. You may supply either the link ID or the alias.',
            required: true
          },
          {
            key: 'alias',
            type: 'string',
            description: 'The link alias. You may supply either the link ID or the alias.',
            example: 'alias',
            required: true
          },
          {
            key: 'password',
            type: 'string',
            description: 'The link password, if applicable. This is required only when accessing ' +
              'password-protected links while not authenticated as the user who created the link.',
            required: false
          }
        ],
        response: [
          {
            key: 'details',
            type: 'object',
            description: 'An object with all link details. The schema for this object is ' +
              'provided below.',
            example: {
              link_id: 1,
              user_id: 1,
              submit_time: 1485442297,
              alias: 'alias',
              full_alias: `${context.config.LINKR_URL}/alias`,
              outgoing_url: 'https://google.com',
              is_password_protected: false
            }
          },
          {
            key: 'details.link_id',
            type: 'number',
            description: 'The link ID.'
          },
          {
            key: 'details.user_id',
            type: 'number',
            description: 'The ID of the user who created the link.'
          },
          {
            key: 'details.submit_time',
            type: 'number',
            description: 'The Unix timestamp at which the link was submitted.'
          },
          {
            key: 'details.alias',
            type: 'string',
            description: 'The link alias.'
          },
          {
            key: 'details.full_alias',
            type: 'string',
            description: 'The fully qualified link alias (e.g. including the URL).'
          },
          {
            key: 'details.outgoing_url',
            type: 'string',
            description: 'The link\'s outgoing URL.'
          },
          {
            key: 'details.is_password_protected',
            type: 'boolean',
            description: 'True if the link is password-protected; false otherwise.'
          }
        ],
        errors: [
          {
            failure: 'failure_nonexistent_link',
            description: 'No such link exists with the provided link ID or alias.'
          },
          {
            failure: 'failure_incorrect_link_password',
            description: 'For password-protected links only. Either no password was supplied ' +
              'when one is required, or the supplied password is incorrect.'
          }
        ]
      }
    },
    {
      meta: {
        title: 'Delete a link',
        subtitle: 'Delete an existing link',
        description: 'Delete a link created by an authenticated user. Access to this endpoint is ' +
          'permitted if the authenticated user owns the link to delete, or if the authenticated ' +
          'user is an admin.',
        authentication: AUTHENTICATION_REQUIRED
      },
      endpoint: {
        method: 'DELETE',
        uri: 'LinkDeleteURI',
        parameters: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The link ID to delete.',
            example: 1,
            required: true
          }
        ],
        response: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The former ID of the link that was successfully deleted.',
            example: 1
          }
        ],
        errors: [
          {
            failure: 'failure_nonexistent_link',
            description: 'No such link exists with the provided link ID or alias.'
          },
          {
            failure: 'failure_unauth',
            description: 'This link ID for which deletion was requested is owned by a user ID ' +
              'that disagrees with that of the authenticated user.'
          }
        ]
      }
    },
    {
      meta: {
        title: 'Edit a link',
        subtitle: 'Edit an existing link',
        description: 'Edit a link created by an authenticated user. Access to this endpoint is ' +
          'permitted if the authenticated user owns the link to edit, or if the authenticated ' +
          'user is an admin.',
        authentication: AUTHENTICATION_REQUIRED
      },
      endpoint: {
        method: 'POST',
        uri: 'LinkEditURI',
        parameters: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The link ID to edit.',
            example: 1,
            required: true
          },
          {
            key: 'alias',
            type: 'string',
            description: 'The new alias for this link. Omit or leave blank to leave it unchanged.',
            example: 'new-alias',
            required: false
          },
          {
            key: 'outgoing_url',
            type: 'string',
            description: 'The new outgoing URL for this link. Omit or leave blank to leave it ' +
              'unchanged.',
            example: 'https://google.com',
            required: false
          }
        ],
        response: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The ID of the link that was successfully edited.',
            example: 1
          },
          {
            key: 'alias',
            type: 'string',
            description: 'The now-edited link\'s alias.',
            example: 'new-alias'
          },
          {
            key: 'outgoing_url',
            type: 'string',
            description: 'The now-edited link\'s outgoing URL.',
            example: 'https://google.com'
          }
        ],
        errors: [
          {
            failure: 'failure_nonexistent_link',
            description: 'No such link exists with the provided link ID.'
          },
          {
            failure: 'failure_unauth',
            description: 'This link ID for which editing was requested is owned by a user ID ' +
              'that disagrees with that of the authenticated user.'
          },
          {
            failure: 'failure_invalid_alias',
            description: 'The requested new alias is invalid because it is either not URL-safe ' +
              'or is too long.'
          },
          {
            failure: 'failure_invalid_url',
            description: 'The requested new outgoing URL is invalid. Please ensure that it is a ' +
              'valid, parsable URL.'
          }
        ]
      }
    },
    {
      meta: {
        title: 'Preview a link',
        subtitle: 'Preview metadata about a link',
        description: 'Preview metadata about the outgoing URL associated with a link, including ' +
          'the document title, description, and an image on the page. Access to this endpoint is ' +
          'permitted if the authenticated user owns the link to preview, or if the authenticated ' +
          'user is an admin.',
        authentication: AUTHENTICATION_REQUIRED
      },
      endpoint: {
        method: 'POST',
        uri: 'LinkPreviewURI',
        parameters: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The link ID to preview.',
            example: 1,
            required: true
          }
        ],
        response: [
          {
            key: 'link_id',
            type: 'number',
            description: 'The ID of the link whose preview was requested.',
            example: 1
          },
          {
            key: 'preview',
            type: 'object',
            description: 'An object describing metadata about the link\'s outgoing URL. ' +
              'Descriptions of each of its fields appear below.',
            example: {
              title: 'Breaking News, World News & Multimedia',
              description: 'The New York Times: Find breaking news, multimedia, reviews & ' +
                'opinion on Washington, business, sports, movies, travel, books, jobs, ' +
                'education, real estate, cars & more at nytimes.com.',
              image: 'https://static01.nyt.com/images/icons/t_logo_291_black.png'
            }
          },
          {
            key: 'preview.title',
            type: 'string|null',
            description: 'The page title, if available.'
          },
          {
            key: 'preview.description',
            type: 'string|null',
            description: 'The page description, if available.'
          },
          {
            key: 'preview.image',
            type: 'string|null',
            description: 'URL to the primary image on the page, if available.'
          }
        ],
        errors: [
          {
            failure: 'failure_nonexistent_link',
            description: 'No such link exists with the provided link ID.'
          },
          {
            failure: 'failure_unauth',
            description: 'This link ID for which a preview was requested is owned by a user ID ' +
              'that disagrees with that of the authenticated user. For security reasons, you may ' +
              'only preview links that you create.'
          }
        ]
      }
    }
  ]
};

export default data;
