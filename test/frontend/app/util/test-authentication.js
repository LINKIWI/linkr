import request from 'browser-request';
import sinon from 'sinon';
import test from 'tape';

import authentication from '../../../../frontend/app/util/authentication';

test('Check current authentication status with error', (t) => {
  const requestStub = sinon.stub(request, 'post', (opts, cb) => cb('err'));

  authentication.check((user) => {
    t.ok(requestStub.called, 'Request is made');
    t.deepEqual(user, {}, 'User object is empty');
  });

  request.post.restore();
  t.end();
});

test('Check current authentication status with non-HTTP 200', (t) => {
  const requestStub = sinon.stub(request, 'post', (opts, cb) => cb(null, {statusCode: 500}));

  authentication.check((user) => {
    t.ok(requestStub.called, 'Request is made');
    t.deepEqual(user, {}, 'User object is empty');
  });

  request.post.restore();
  t.end();
});

test('Successful check current authentication status', (t) => {
  const requestStub = sinon.stub(request, 'post', (opts, cb) => {
    return cb(null, {statusCode: 200}, {user: {user: true}});
  });

  authentication.check((user) => {
    t.ok(requestStub.called, 'Request is made');
    t.deepEqual(user, {user: true}, 'User object is extracted from API response');
  });

  request.post.restore();
  t.end();
});

test('Authentication logout', (t) => {
  const requestStub = sinon.stub(request, 'post', (opts, cb) => cb());

  authentication.logout(() => {
    t.ok(requestStub.called, 'Request is made');
  });

  request.post.restore();
  t.end();
});
