import {atomOneDark} from 'react-syntax-highlighter/dist/styles';
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
 * @returns {XML} React element.
 * @constructor
 */
const APIRequestExample = ({language, method, endpoint, data}) => {
  const formattedCode = format(templates[language], {
    method: language === 'curl' ? method : method.toLowerCase(),
    url: `${context.config.LINKR_URL}${endpoint}`,
    data: stringify(data, {maxLength: Infinity})
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
