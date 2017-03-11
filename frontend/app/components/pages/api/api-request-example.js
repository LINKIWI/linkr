import atomOneDark from 'react-syntax-highlighter/dist/styles/atom-one-dark';
import format from 'string-template';
import React from 'react';
import stringify from 'json-stringify-pretty-compact';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';

import templates from './api-code-templates';

import context from '../../../util/context';

/**
 * Example API request code.
 *
 * @param {String} language The currently selected example language.
 * @param {String} method The HTTP method for this endpoint.
 * @param {String} endpoint The URI of the endpoint.
 * @param {Object} data Example request data.
 * @param apiKey
 * @returns {XML} React element.
 * @constructor
 */
const APIRequestExample = ({language, method, endpoint, data, apiKey}) => {
  const formattedCode = format(templates[language], {
    method: language === 'curl' ? method : method.toLowerCase(),
    url: `${context.config.linkr_url}${endpoint}`,
    data: stringify(data, {maxLength: Infinity}),
    apiKey: apiKey ? apiKey : 'YOUR_API_KEY'
  });

  return (
    <SyntaxHighlighter language={language} style={atomOneDark}>
      {formattedCode}
    </SyntaxHighlighter>
  );
};

APIRequestExample.propTypes = {
  language: React.PropTypes.oneOf(Object.keys(templates)),
  method: React.PropTypes.oneOf(['GET', 'POST', 'DELETE', 'PUT']),
  endpoint: React.PropTypes.string,
  data: React.PropTypes.object
};

APIRequestExample.defaultProps = {
  language: 'curl',
  endpoint: '',
  method: 'POST',
  data: {}
};

export default APIRequestExample;
