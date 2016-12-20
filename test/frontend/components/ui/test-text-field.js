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

  t.equal(field.props().className, '', 'Empty default class name');
  t.equal(field.props().type, 'text', 'Defaults to text input type');
  t.deepEquals(field.props().style, {}, 'Empty default style override');

  t.notOk(onChangeSpy.called, 'Change handler is not called');
  field.simulate('change', {target: {value: 'text'}});
  t.notOk(onChangeSpy.called, 'Default change handler is a noop');

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
