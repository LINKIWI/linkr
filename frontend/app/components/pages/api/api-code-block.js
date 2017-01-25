import React from 'react';

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
