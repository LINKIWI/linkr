/* global window, setTimeout */

import {browserHistory} from 'react-router';
import url from 'url';

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
 * Parse the current window URL.
 *
 * @returns {Object} Parsed URL object.
 */
function parseURL() {
  return url.parse(window.location.href);
}

export default {
  go,
  push,
  parseURL
};
