import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import TextField from '../../../../frontend/app/components/ui/text-field';

test('Rendering default TextField', (t) => {
  const onChangeSpy = sinon.spy();
  const field = mount(
    <TextField />
  );

  t.equal(field.find('input').length, 1, 'Contains an input element');
  t.equal(field.find('input').props().className, 'text-field ', 'Default class is applied');

  t.end();
});

test('TextField change handler', (t) => {
  const onChangeSpy = sinon.spy();
  const field = mount(
    <TextField
      onChange={onChangeSpy}
    />
  );

  t.notOk(onChangeSpy.called, 'Change handler is not called');
  field.simulate('change', {target: {value: 'text'}});
  t.ok(onChangeSpy.called, 'Change handler is triggered');

  t.end();
});

test('Setting and getting TextField contents', (t) => {
  const field = mount(
    <TextField />
  );

  t.equal(field.instance().getValue(), '', 'Initially empty contents');
  field.instance().setValue('text');
  t.equal(field.instance().getValue(), 'text', 'Contents are properly modified');

  t.end();
});
