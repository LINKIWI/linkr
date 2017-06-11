/* global window */

import {browserHistory} from 'react-router';
import jsdom from 'jsdom';
import sinon from 'sinon';
import test from 'tape';

import browser from '../../../../frontend/app/util/browser';
import context from '../../../../frontend/app/util/context';

test('browser.go after a delay', (t) => {
  const clock = sinon.useFakeTimers();

  const id = browser.go('https://google.com', 100);
  clock.tick(1000);

  t.ok(id >= 0, 'Procedure returns a timeout ID');

  clock.restore();
  t.end();
});

test('browser.push after a delay', (t) => {
  const browserHistoryStub = sinon.stub(browserHistory, 'push');
  const clock = sinon.useFakeTimers();

  const id = browser.push('/path', 100);
  clock.tick(1000);

  t.ok(id >= 0, 'Procedure returns a timeout ID');
  t.ok(browserHistoryStub.calledWith('/path'), 'Browser history state is modified');

  clock.restore();
  browserHistory.push.restore();
  t.end();
});

test('browser.hash sets the current URL hash', (t) => {
  jsdom.changeURL(window, 'https://google.com');

  browser.hash('hash');

  t.equal(window.location.href, 'https://google.com/#hash', 'Hash value is set on URL');

  t.end();
});

test('browser.clearTimeout aliases window.clearTimeout', (t) => {
  const clearTimeoutStub = sinon.stub(window, 'clearTimeout');

  browser.clearTimeout(1);

  t.ok(clearTimeoutStub.calledWith(1), 'Arguments are passed directly to window.clearTimeout');

  window.clearTimeout.restore();
  t.end();
});

test('browser.loginRedirect imperatively redirects to login with a reason', (t) => {
  jsdom.changeURL(window, 'https://google.com/page');
  context.uris.LoginURI = 'login-uri';
  const pushStub = sinon.stub(browserHistory, 'push');

  browser.loginRedirect('reason');

  t.ok(pushStub.calledWith({
    pathname: 'login-uri',
    query: {
      redirect: '/page',
      reason: 'reason'
    }
  }), 'Redirect occurs with correct parameters');

  browserHistory.push.restore();
  t.end();
});

test('browser.parseURL parses current URL with query string', (t) => {
  jsdom.changeURL(window, 'https://auth.kevinlin.info?redirect=https://google.com');

  const parsed = browser.parseURL();

  t.equal(parsed.host, 'auth.kevinlin.info', 'Host is parsed');
  t.equal(parsed.query.redirect, 'https://google.com', 'Query string redirect is parsed');

  t.end();
});
