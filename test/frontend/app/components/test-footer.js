import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import authentication from '../../../../frontend/app/util/authentication';
import browser from '../../../../frontend/app/util/browser';
import {Footer} from '../../../../frontend/app/components/footer';

const loadingStub = (func) => func(() => {});

test('Footer is not rendered if no user is logged in', (t) => {
  const footer = mount(
    <Footer user={{}} />
  );

  t.equal(footer.find('.footer-container').length, 0, 'Footer is not rendered');

  t.end();
});

test('Footer shows currently logged in user', (t) => {
  const footer = mount(
    <Footer
      isLoading={false}
      loading={loadingStub}
      user={{username: 'username'}}
    />
  );

  t.equal(footer.find('.footer-container').length, 1, 'Footer is rendered');
  t.equal(footer.find('.footer-username').props().children, 'USERNAME', 'Username is displayed');

  t.end();
});

test('Footer exposes account and logout buttons', (t) => {
  const pushStub = sinon.stub(browser, 'push');
  const goStub = sinon.stub(browser, 'go');
  const logoutStub = sinon.stub(authentication, 'logout', (cb) => cb());
  const footer = mount(
    <Footer
      isLoading={false}
      loading={loadingStub}
      user={{username: 'username'}}
    />
  );

  t.equal(footer.find('.footer-account-button').length, 1, 'Account button');
  footer.find('.footer-account-button').simulate('click');
  t.ok(pushStub.called, 'User account page is pushed');
  footer.find('.footer-logout-button').simulate('click');
  t.ok(logoutStub.called, 'Logout is performed');
  t.ok(goStub.called, 'Page redirect to home');

  browser.push.restore();
  browser.go.restore();
  authentication.logout.restore();
  t.end();
});
