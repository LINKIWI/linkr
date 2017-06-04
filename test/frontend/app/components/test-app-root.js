import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import AppRoot from '../../../../frontend/app/components/app-root';

test('Splash behavior on app root component', (t) => {
  const clock = sinon.useFakeTimers();

  const appRoot = mount(
    <AppRoot />
  );

  t.equal(appRoot.find('Favicon').length, 1, 'Favicon is present');
  t.ok(appRoot.state().splashVisible, 'Splash is initially visible');
  t.equal(appRoot.find('Splash').length, 1, 'Splash element is rendered on page');
  clock.tick(200);
  t.notOk(appRoot.state().splashVisible, 'Splash is not visible after a timeout');
  t.equal(appRoot.find('Splash').length, 0, 'Splash element is no longer rendered on page');

  clock.restore();
  t.end();
});
