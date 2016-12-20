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
  }, (err, resp) => {
    cb(!err && resp.statusCode === 200);
  });
}

export default {
  check
};
