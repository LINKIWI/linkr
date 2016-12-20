import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import Button from '../../../../frontend/app/components/ui/button';

test('Enabled button', (t) => {
  const spy = sinon.spy();
  const button = mount(
    <Button
      onClick={spy}
    >
      text
    </Button>
  );

  // Default props
  t.notOk(button.props().disabled, 'Defaults to enabled state');
  t.deepEquals(button.props().style, {}, 'Default empty style overrides');
  t.equals(button.props().children, 'text', 'Button text contents');

  // Onclick behavior
  t.notOk(spy.called, 'onClick is not triggered before click');
  button.simulate('click');
  t.ok(spy.called, 'onClick is triggered after click');
  button.simulate('mouseOut');

  t.end();
});

test('Disabled button', (t) => {
  const spy = sinon.spy();
  const button = mount(
    <Button
      disabled={true}
      onClick={spy}
    />
  );

  t.ok(button.props().disabled, 'Props reflect disabled input');
  t.deepEquals(button.props().style, {}, 'Default empty style overrides');

  // Onclick behavior
  t.notOk(spy.called, 'onClick is not triggered before click');
  button.simulate('click');
  t.notOk(spy.called, 'onClick is still not triggered on a disabled button');

  t.end();
});
