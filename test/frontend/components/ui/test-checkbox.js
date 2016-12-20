import React from 'react';
import {mount} from 'enzyme';
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
  check.find('.check-container').simulate('click');
  t.ok(check.instance().isChecked(), 'Checkbox is checked after click');
  check.find('.check-container').simulate('click');
  t.notOk(check.instance().isChecked(), 'Checkbox transitions back to unchecked state');
  check.find('.check-container').simulate('mouseOut');

  t.end();
});

test('Checkbox toggles on keyboard events', (t) => {
  const check = mount(
    <Checkbox />
  );

  t.notOk(check.instance().isChecked(), 'Checkbox defaults to not checked');
  check.find('.check-container').simulate('keyDown', {
    keyCode: 13
  });
  t.ok(check.instance().isChecked(), 'Checkbox is checked after enter key');
  check.find('.check-container').simulate('keyDown', {
    keyCode: 27
  });
  t.notOk(check.instance().isChecked(), 'Checkbox is unchecked after escape key');
  check.find('.check-container').simulate('keyDown', {
    keyCode: 32
  });
  t.ok(check.instance().isChecked(), 'Checkbox is checked after space key');
  check.find('.check-container').simulate('keyDown', {
    keyCode: 5
  });
  t.ok(check.instance().isChecked(), 'Unknown key code does not change checked state');

  t.end();
});
