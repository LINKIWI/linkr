import {atomOneDark} from 'react-syntax-highlighter/dist/styles';
import {Link} from 'react-router';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';

import APICodeBlock from './api-code-block';
import APIRequestExample from './api-request-example';
import InfoTable from '../../info-table';

import context from '../../../util/context';

function inlineCode(code) {
  return <span className="monospace bold">{code}</span>;
}

/**
 * API overview details.
 *
 * @param {String} language The currently selected language.
 * @param {Object} props Proxied props.
 * @constructor
 */
const APIInformation = ({language, ...props}) => (
  <div {...props}>
    <div className="margin--bottom">
      <p className="text--section-header">
        Linkr API
      </p>
      <p className="sans-serif iota text-gray-70">
        Linkr provides a robust, RESTful API for programmatically interacting with the backend.
        There exists a one-to-one mapping between operations that can be performed in the frontend
        web interface and available API endpoints, allowing you to build powerful, flexible
        applications on top of Linkr's functionality.
      </p>
    </div>

    <div className="margin--bottom">
      <p className="text--section-header">
        Requests and Responses
      </p>

      <APICodeBlock caption="Response JSON schema">
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {
            JSON.stringify({
              success: 'bool (whether the request was successful)',
              message: 'string|null (description of how the request was processed)',
              failure: 'string (failure code string, if success === false)'
            }, null, 2)
          }
        </SyntaxHighlighter>
      </APICodeBlock>

      <p className="sans-serif iota text-gray-70 margin-small--bottom">
        All API endpoints accept as input {inlineCode('application/json')}-MIME type JSON in the
        request body, and return {inlineCode('application/json')}-MIME type JSON in the response
        body. It is suggested that requests
        specify {inlineCode('Content-Type: application/json')} explicitly.
      </p>
      <p className="sans-serif iota text-gray-70 margin-small--bottom">
        All API responses return JSON data in the same shape, regardless of whether the request was
        successful. Every response is guaranteed to have a JSON response body, and the JSON object
        is guaranteed to have at least
        parameters {inlineCode('success')} and {inlineCode('message')}. When a request is not
        successful (status code != 200), the response body is guaranteed to contain
        parameter {inlineCode('failure')}.
      </p>
      <p className="sans-serif iota text-gray-70 margin-small--bottom">
        An example JSON response appears on the right.
      </p>
    </div>

    <div className="margin--bottom">
      <p className="text--section-header">
        Authentication
      </p>

      <APICodeBlock
        caption={
          <span>
            Example authenticated request using the {inlineCode('X-Linkr-Key')} header
          </span>
        }
      >
        <APIRequestExample
          language={language}
          method="POST"
          endpoint={context.uris.LinkDetailsURI}
          data={{
            /* eslint-disable camelcase */
            link_id: 1
            /* eslint-enable camelcase */
          }}
        />
      </APICodeBlock>

      <p className="sans-serif iota text-gray-70 margin--bottom">
        Endpoints are accessed either with or without authentication. All endpoints fall into one
        of the below categories:
      </p>
      <InfoTable
        className="margin--bottom"
        entries={[
          {
            key: 'Authentication required',
            value: 'The action will be successful only if authentication is supplied.'
          },
          {
            key: 'Authentication optional',
            value: 'Authentication may optionally be supplied for extended functionality, but ' +
              'the request will complete without any supplied authentication.'
          },
          {
            key: 'Authentication not required',
            value: 'The endpoint does not make use of authentication, and any supplied authentication will be ignored.'
          }
        ]}
      />
      <p className="sans-serif iota text-gray-70 margin--bottom">
        API authentication is accomplished exclusively via your account's API key. You can view and
        regenerate your API key in
        your <Link to={context.uris.UserAccountURI}>account settings</Link>.
      </p>

      <p className="sans-serif bold iota text-gray-70 margin-tiny--bottom">
        Authentication via {inlineCode('X-Linkr-Key')} header value (recommended)
      </p>
      <p className="sans-serif iota text-gray-70 margin--bottom">
        You can authenticate an API request by adding the
        header {inlineCode('X-Linkr-Key: [YOUR API KEY]')} to the request.
      </p>

      <p className="sans-serif bold iota text-gray-70 margin-tiny--bottom">
        Authentication via request body parameter
      </p>
      <p className="sans-serif iota text-gray-70 margin-small--bottom">
        You can also authenticate by passing your API key as the JSON
        key {inlineCode('api_key')} in the request body. This parameter is recognized on all API
        endpoints.
      </p>
    </div>
  </div>
);

export default APIInformation;
