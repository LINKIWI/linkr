import React from 'react';

const Container = ({className, style, children}) => (
  <div className={`container content-container transition ${className}`} style={style}>
    {children}
  </div>
);

export default Container;
