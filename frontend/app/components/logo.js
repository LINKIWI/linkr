/* global config */

import browserHistory from 'react-router/lib/browserHistory';
import dottie from 'dottie';
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
    <span className="logo sans-serif bold text-primary">
      {dottie.get(config, 'options.title', 'linkr')}
    </span>
  </span>
);

export default Logo;
