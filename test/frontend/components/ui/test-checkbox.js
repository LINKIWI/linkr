import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import Checkbox from '../../../../frontend/app/components/ui/checkbox';

test('Checkbox respects passed check state and text', (t) => {
  const check = mount(
    <Checkbox
      isChecked={true}
      text={'text'}
    />
  );

  t.ok(check.instance().isChecked(), 'Component reports that the box is checked');
  t.ok(check.find('.check').props().className.indexOf('visible') !== -1,
    'Check is visible');
  t.ok(check.find('.check').props().className.indexOf('hidden') === -1,
    'Check is not hidden');
  t.equal(check.find('.checkbox-text').props().children, 'text', 'Checkbox text is rendered');

  t.end();
});

test('Checkbox toggles on click events', (t) => {
  const check = mount(
    <Checkbox />
  );

  t.notOk(check.instance().isChecked(), 'Checkbox defaults to not checked');
  check.find('.checkbox').simulate('click');
  t.ok(check.instance().isChecked(), 'Checkbox is checked after click');
  check.find('.checkbox').simulate('click');
  t.notOk(check.instance().isChecked(), 'Checkbox transitions back to unchecked state');
  check.find('.checkbox-text').simulate('click');
  t.ok(check.instance().isChecked(), 'Checkbox can be checked by the text caption');
  check.find('.checkbox').simulate('mouseOut');

  t.end();
});

test('Checkbox toggles on keyboard events', (t) => {
  const check = mount(
    <Checkbox />
  );

  t.notOk(check.instance().isChecked(), 'Checkbox defaults to not checked');
  check.find('.checkbox').simulate('keyDown', {
    keyCode: 13
  });
  t.ok(check.instance().isChecked(), 'Checkbox is checked after enter key');
  check.find('.checkbox').simulate('keyDown', {
    keyCode: 27
  });
  t.notOk(check.instance().isChecked(), 'Checkbox is unchecked after escape key');
  check.find('.checkbox').simulate('keyDown', {
    keyCode: 32
  });
  t.ok(check.instance().isChecked(), 'Checkbox is checked after space key');
  check.find('.checkbox').simulate('keyDown', {
    keyCode: 5
  });
  t.ok(check.instance().isChecked(), 'Unknown key code does not change checked state');
  check.find('.checkbox').simulate('keyDown', {
    keyCode: 32
  });
  t.notOk(check.instance().isChecked(), 'Space can toggle the current check state');

  t.end();
});

test('Check and uncheck event handlers', (t) => {
  const onCheckSpy = sinon.spy();
  const onUncheckSpy = sinon.spy();
  const check = mount(
    <Checkbox
      onCheck={onCheckSpy}
      onUncheck={onUncheckSpy}
    />
  );

  t.notOk(onCheckSpy.called, 'onCheck is not called on component mount');
  t.notOk(onUncheckSpy.called, 'onUncheck is not called on component mount');
  check.find('.check-container').simulate('click');
  t.ok(onCheckSpy.called, 'onCheck is called after click');
  t.notOk(onUncheckSpy.called, 'onUncheck is not called after initial click');
  check.find('.check-container').simulate('click');
  t.ok(onUncheckSpy.called, 'onUncheck is called after second click');

  t.end();
});
