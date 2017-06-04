import {shallow} from 'enzyme';
import React from 'react';
import test from 'tape';

import App from '../../../frontend/app/app';

test('Client-side app initialization', (t) => {
  const app = shallow(
    <App />
  );

  t.equal(app.find('Router').length, 1, 'react-router instance is initialized');

  t.end();
});
