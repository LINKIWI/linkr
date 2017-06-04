import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import authentication from '../../../../../frontend/app/util/authentication';
import AuthenticationHOC from '../../../../../frontend/app/components/hoc/authentication-hoc';

const component = class Component extends React.Component {
  render() {
    return (
      <div>contents</div>
    );
  }
};

test('HOC checks unauth status on mount', (t) => {
  const checkStub = sinon.stub(authentication, 'check', (cb) => cb({}));
  const hoc = mount(React.createElement(AuthenticationHOC(component)));

  t.ok(checkStub.called, 'Authentication check is attempted');
  t.ok(hoc.find(component).length, 1, 'Wrapped component is present');
  t.notOk(hoc.state().isLoggedIn, 'Not logged in');
  t.notOk(hoc.find(component).props().isLoggedIn, 'State is propagated to child as props');
  t.deepEqual(hoc.state().user, {}, 'User object is empty');

  authentication.check.restore();
  t.end();
});

test('HOC checks auth status on mount', (t) => {
  const checkStub = sinon.stub(authentication, 'check', (cb) => cb({username: 'username'}));
  const hoc = mount(React.createElement(AuthenticationHOC(component)));

  t.ok(checkStub.called, 'Authentication check is attempted');
  t.ok(hoc.find(component).length, 1, 'Wrapped component is present');
  t.ok(hoc.state().isLoggedIn, 'Logged in');
  t.ok(hoc.find(component).props().isLoggedIn, 'State is propagated to child as props');
  t.deepEqual(hoc.state().user, {username: 'username'}, 'User object is non-empty');

  authentication.check.restore();
  t.end();
});
