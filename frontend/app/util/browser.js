/* global window, setTimeout */

import {browserHistory} from 'react-router';
import url from 'url';

import context from './context';

/**
 * Load the specified URL after a delay.
 *
 * @param {String} location The URL to load.
 * @param {Number=} delay Milliseconds to delay the page load.
 */
function go(location, delay) {
  if (!delay || delay <= 0) {
    window.location.href = location;
  } else {
    setTimeout(() => go(location, 0), delay);
  }
}

/**
 * Push the specified path to browser history, handled via react-router.
 *
 * @param {String} path The path to push.
 * @param {Number=} delay Milliseconds to delay the push.
 */
function push(path, delay) {
  if (!delay || delay <= 0) {
    browserHistory.push(path);
  } else {
    setTimeout(() => push(path, 0), delay);
  }
}

/**
 * Redirect to the login interface, passing a reason code as a querystring parameter.
 *
 * @param {String} reason A reason code describing why the user was redirected to login.
 */
function loginRedirect(reason) {
  browserHistory.push({
    pathname: context.uris.LoginURI,
    query: {
      redirect: parseURL().pathname,
      reason: reason
    }
  });
}

/**
 * Parse the current window URL.
 *
 * @returns {Object} Parsed URL object.
 */
function parseURL() {
  return url.parse(window.location.href, true);
}

export default {
  go,
  push,
  parseURL,
  loginRedirect
};
