import dottie from 'dottie';
import request from 'browser-request';

import context from './context';

/**
 * Check if the user is currently authenticated.
 *
 * @param {Function} cb Callback function called with a single boolean parameter indicating if the
 *                      session is authenticated.
 */
function check(cb) {
  request.post({
    url: context.uris.AuthCheckURI,
    json: {}
  }, (err, resp, json) => {
    cb(!err && dottie.get(resp, 'statusCode') === 200, dottie.get(json, 'username'));
  });
}

/**
 * Logout the current user.
 *
 * @param {Function} cb Request callback called when logout is completed.
 */
function logout(cb) {
  request.post({
    url: context.uris.AuthLogoutURI,
    json: {}
  }, cb);
}

export default {
  check,
  logout
};
