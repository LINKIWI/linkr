import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import Tooltip, {GRACE_TIMEOUT_INTERVAL} from '../../../../../frontend/app/components/ui/tooltip';

test('Tooltip wraps children elements and adds tooltip element', (t) => {
  const tooltip = mount(
    <Tooltip contents={<span>tooltip</span>}>
      children
    </Tooltip>
  );

  t.equal(tooltip.find('.tooltip-container').length, 1, 'Tooltip container is present');
  t.equal(tooltip.find('.tooltip-children').length, 1, 'Tooltip children wrapper is present');
  t.equal(tooltip.find('.tooltip').length, 1, 'Tooltip contents itself is present');
  t.equal(tooltip.find('.tooltip-children').props().children, 'children',
    'Tooltip children are rendered properly');
  t.equal(tooltip.find('.tooltip').childAt(0).props().children, 'tooltip',
    'Tooltip contents are rendered properly');

  t.end();
});

test('Tooltip can be always displayed', (t) => {
  const tooltip = mount(
    <Tooltip contents={<span>tooltip</span>} alwaysDisplay={true}>
      children
    </Tooltip>
  );

  t.equal(tooltip.find('.tooltip').props().style.opacity, 1, 'Opacity is always unity');

  t.end();
});

test('Tooltip display is toggled by mouse events', (t) => {
  const clock = sinon.useFakeTimers();
  const tooltip = mount(
    <Tooltip contents={<span>tooltip</span>}>
      children
    </Tooltip>
  );
  const container = tooltip.find('.tooltip-container');
  const contents = tooltip.find('.tooltip');

  t.equal(contents.props().style.opacity, 0, 'Tooltip is initially not visible');
  container.simulate('mouseOver');
  t.equal(contents.props().style.opacity, 1, 'Tooltip is visible after mouse over');
  container.simulate('mouseOut');
  // Allow a sufficiently long amount of time to pass
  clock.tick(GRACE_TIMEOUT_INTERVAL * 100);
  t.equal(contents.props().style.opacity, 0, 'Tooltip is no longer visible');

  clock.restore();
  t.end();
});

test('Tooltip remains visible for a grace period after mouse out', (t) => {
  const clock = sinon.useFakeTimers();
  const tooltip = mount(
    <Tooltip contents={<span>tooltip</span>}>
      children
    </Tooltip>
  );
  const container = tooltip.find('.tooltip-container');
  const contents = tooltip.find('.tooltip');

  t.equal(contents.props().style.opacity, 0, 'Tooltip is initially not visible');
  container.simulate('mouseOver');
  t.equal(contents.props().style.opacity, 1, 'Tooltip is visible after mouse over');
  container.simulate('mouseOut');
  t.equal(contents.props().style.opacity, 1,
    'Tooltip is still visible immediately after mouse out');
  clock.tick(GRACE_TIMEOUT_INTERVAL / 2);
  t.equal(contents.props().style.opacity, 1, 'Tooltip is visible before grace period expiry');
  clock.tick(GRACE_TIMEOUT_INTERVAL / 2);
  t.equal(contents.props().style.opacity, 0, 'Tooltip is hidden after grace period expiry');
  container.simulate('mouseOver');
  t.equal(contents.props().style.opacity, 1, 'Tooltip is visible after mouse over');
  clock.tick(GRACE_TIMEOUT_INTERVAL / 2);
  container.simulate('mouseOver');
  t.equal(contents.props().style.opacity, 1,
    'Tooltip maintains visibility after additional mouse over');
  container.simulate('mouseOut');
  clock.tick(GRACE_TIMEOUT_INTERVAL / 2);
  t.equal(contents.props().style.opacity, 1, 'Grace period timeout is reset');
  clock.tick(GRACE_TIMEOUT_INTERVAL / 2);
  t.equal(contents.props().style.opacity, 0, 'Reset grace period expires correctly');

  clock.restore();
  t.end();
});
