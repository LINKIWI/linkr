import {atomOneDark} from 'react-syntax-highlighter/dist/styles';
import extend from 'deep-extend';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';

import APICodeBlock from './api-code-block';
import APIRequestExample from './api-request-example';
import Table from '../../table';

import context from '../../../util/context';

/**
 * Full details for a single API endpoint.
 */
export default class APIEndpoint extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    description: React.PropTypes.string,
    authentication: React.PropTypes.oneOf(['required', 'optional', 'none']),
    language: React.PropTypes.string,
    method: React.PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE']),
    uri: React.PropTypes.oneOf(Object.keys(context.uris)),
    parameters: React.PropTypes.arrayOf(React.PropTypes.shape({
      key: React.PropTypes.string,
      type: React.PropTypes.string,
      description: React.PropTypes.string,
      example: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.object
      ]),
      required: React.PropTypes.bool
    })),
    response: React.PropTypes.arrayOf(React.PropTypes.shape({
      key: React.PropTypes.string,
      type: React.PropTypes.string,
      description: React.PropTypes.string,
      example: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.object
      ])
    })),
    errors: React.PropTypes.arrayOf(React.PropTypes.shape({
      failure: React.PropTypes.string,
      description: React.PropTypes.string
    }))
  };

  render() {
    const {
      user,
      title,
      subtitle,
      description,
      authentication,
      language,
      method,
      uri,
      parameters,
      response,
      errors
    } = this.props;

    const exampleJSON = parameters.reduce((json, parameter) => {
      if (parameter.example) {
        json[parameter.key] = parameter.example;
      }
      return json;
    }, {});

    const authenticationTypes = {
      optional: 'AUTHENTICATION OPTIONAL',
      required: 'AUTHENTICATION REQUIRED',
      none: 'AUTHENTICATION NOT REQUIRED'
    };

    return (
      <div className="margin-huge--bottom">
        <div className="margin--bottom">
          <p className="sans-serif bold text-gray-70 epsilon margin-tiny--bottom">
            {title}
          </p>
          <span className="sans-serif bold iota text-primary margin--left" style={{float: 'right'}}>
            {authenticationTypes[authentication]}
          </span>
          <p className="sans-serif bold text-gray-40 iota">
            {subtitle}
          </p>
        </div>

        <div className="margin--bottom">
          <p className="sans-serif iota text-gray-70">{description}</p>
        </div>

        <APICodeBlock caption="Example request">
          <APIRequestExample
            language={language}
            method={method}
            endpoint={context.uris[uri]}
            data={exampleJSON}
            apiKey={user.api_key}
          />
        </APICodeBlock>

        <div className="margin--bottom">
          <p className="text--section-header">HTTP Endpoint</p>
          <div className="api-inline-code">
            {method.toUpperCase()} {context.config.LINKR_URL}{context.uris[uri]}
          </div>
        </div>

        <div className="api-description margin--bottom">
          <p className="text--section-header">Parameters</p>
          <Table
            className="sans-serif text-gray-60 iota"
            headerClassName="sans-serif bold"
            header={['KEY', 'TYPE', 'REQUIRED', 'DESCRIPTION']}
            entries={parameters.map((parameter) => [
              parameter.key,
              <span className="monospace">{parameter.type}</span>,
              parameter.required ? 'Yes' : 'No',
              parameter.description
            ])}
          />
        </div>

        <APICodeBlock caption="Example response">
          <SyntaxHighlighter language="javascript" style={atomOneDark}>
            {
              JSON.stringify(extend(
                {
                  success: true,
                  message: null
                },
                response.reduce((json, parameter) => {
                  if (parameter.example) {
                    json[parameter.key] = parameter.example;
                  }
                  return json;
                }, {})
              ), null, 2)
            }
          </SyntaxHighlighter>
        </APICodeBlock>

        <div className="margin--bottom">
          <p className="text--section-header">Response</p>
          <Table
            className="sans-serif text-gray-60 iota"
            headerClassName="sans-serif bold"
            header={['KEY', 'TYPE', 'DESCRIPTION']}
            entries={response.map((parameter) => [
              parameter.key,
              <span className="monospace">{parameter.type}</span>,
              parameter.description
            ])}
          />
        </div>

        <div>
          <p className="text--section-header">Errors</p>
          <Table
            className="sans-serif text-gray-60 iota"
            headerClassName="sans-serif bold"
            header={['FAILURE CODE', 'DESCRIPTION']}
            entries={errors.map((error) => [
              error.failure,
              error.description
            ])}
          />
        </div>
      </div>
    );
  }
}
