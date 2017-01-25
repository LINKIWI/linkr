import {atomOneDark} from 'react-syntax-highlighter/dist/styles';
import format from 'string-template';
import React from 'react';
import stringify from 'json-stringify-pretty-compact';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';

import templates from './api-code-templates';

import context from '../../../util/context';

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
