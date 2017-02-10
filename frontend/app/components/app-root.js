import Favicon from 'react-favicon';
import React from 'react';

const AppRoot = ({children}) => (
  <div className="app-root">
    <Favicon
      animated={false}
      url={['/static/img/favicon.png']}
    />
    {children}
  </div>
);

export default AppRoot;
