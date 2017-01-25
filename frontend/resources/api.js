const data = {
  endpoints: [
    {
      meta: {
        title: 'Create a new link',
        subtitle: 'Create a new anonymous or authorized link',
        description: 'Create a new link (association between an alias and an outgoing URL). The ' +
          'new link will be tied to your user account if you make an authenticated request to ' +
          'this endpoint.',
        authentication: 'optional'
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
        ]
      }
    }
  ]
};

export default data;
