import React from 'react';
import {mount} from 'enzyme';
import test from 'tape';

import Alert, {ALERT_TYPE_ERROR} from '../../../frontend/app/components/alert';

test('Alert renders failure message override', (t) => {
  const alert = mount(
    <Alert
      type={ALERT_TYPE_ERROR}
      title={'title'}
      message={'overridden'}
      failure={'failure'}
      failureMessages={{
        failure: 'failure message'
      }}
    />
  );

  t.ok(alert.find('.alert').props().className.indexOf('alert alert-error text-red') !== -1,
    'Alert error class is properly applied');
  t.equal(alert.find('.alert-title').props().children, 'title', 'Title is rendered');
  t.equal(alert.find('.alert-message').props().children, 'failure message',
    'Failure message is rendered');

  t.end();
});

test('Alert renders arbitrary messages as elements', (t) => {
  const alert = mount(
    <Alert
      type={ALERT_TYPE_ERROR}
      title={'title'}
      message={<span>element</span>}
    />
  );

  t.ok(alert.find('.alert').props().className.indexOf('alert alert-error text-red') !== -1,
    'Alert error class is properly applied');
  t.equal(alert.find('.alert-title').props().children, 'title', 'Title is rendered');
  t.equal(alert.find('.alert-message').childAt(0).props().children, 'element',
    'Message element is rendered');

  t.end();
});

test('Alert renders no message if not available', (t) => {
  const alert = mount(
    <Alert
      type={ALERT_TYPE_ERROR}
      title={'title'}
    />
  );

  t.ok(alert.find('.alert').props().className.indexOf('alert alert-error text-red') !== -1,
    'Alert error class is properly applied');
  t.equal(alert.find('.alert-title').props().children, 'title', 'Title is rendered');
  t.notOk(alert.find('.alert-message').props().children, 'No message is displayed');

  t.end();
});
