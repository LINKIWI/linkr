import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import Splash from '../../../../frontend/app/components/splash';

test('Splash destroy timeout', (t) => {
  const clock = sinon.useFakeTimers();
  const splash = mount(
    <Splash />
  );

  t.equal(splash.state().opacity, 1, 'Splash is initially fully opaque');
  splash.instance().destroy();
  clock.tick(10);
  t.equal(splash.state().opacity, 0, 'Splash is invisible after a small timeout');

  clock.restore();
  t.end();
});
