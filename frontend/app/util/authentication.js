import dottie from 'dottie';
import request from 'browser-request';

import context from './context';

/**
 * Check if the user is currently authenticated.
 *
 * @param {Function} cb Callback function called with a single parameter that is an object with the
 *                      logged in user details, or null if the user is not logged in.
 */
function check(cb) {
  request.post({
    url: context.uris.AuthCheckURI,
    json: {}
  }, (err, resp, json) => {
    cb(!err && dottie.get(resp, 'statusCode') === 200 && dottie.get(json, 'user'));
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
