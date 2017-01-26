import React from 'react';

/**
 * Generate a right-aligned code block.
 *
 * @param {String} caption Optional code block caption/header.
 * @param {XML} children Nested children are the code block contents.
 * @returns {XML} React element.
 * @constructor
 */
const APICodeBlock = ({caption, children}) => {
  return (
    <div className="api-code-container">
      {caption && (
        <div className="api-caption sans-serif bold text-gray-30 margin--bottom">
          {caption}
        </div>
      )}
      <pre className="monospace bold iota text-gray-20">
        <div className="api-code">
          {children}
        </div>
      </pre>
    </div>
  );
};

APICodeBlock.propTypes = {
  caption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
};

APICodeBlock.defaultProps = {
  caption: null
};

export default APICodeBlock;
