import {browserHistory} from 'react-router';
import React from 'react';

import context from '../util/context';

const Logo = () => (
  <span
    style={{
      cursor: 'pointer'
    }}
    onClick={() => {
      browserHistory.push(context.uris.HomeURI);
    }}
  >
    <span className="logo sans-serif bold text-primary">linkr</span>
  </span>
);

export default Logo;
