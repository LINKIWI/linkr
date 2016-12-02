import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import {POSITION_LEFT, POSITION_RIGHT, BOUNCE_INTERVAL} from '../../../../frontend/app/components/ui/loading-bar';
import LoadingBar from '../../../../frontend/app/components/ui/loading-bar';

test('Loading bar state update logic', (t) => {
  const clock = sinon.useFakeTimers();
  const loadingBar = mount(
    <LoadingBar />
  );

  // Initial state
  t.equals(loadingBar.state().position, POSITION_LEFT, 'Initial position state');
  t.equals(loadingBar.find('.loading-bar').props().style.marginLeft, `calc(${POSITION_LEFT}% + ${-POSITION_RIGHT}px)`,
    'Initial style override');

  // Simulate time events
  clock.tick(5);
  t.equals(loadingBar.state().position, POSITION_RIGHT, 'First tick of position state');
  clock.tick(BOUNCE_INTERVAL);
  t.equals(loadingBar.state().position, POSITION_LEFT, 'Position state bounces back');

  clock.restore();
  t.end();
});
