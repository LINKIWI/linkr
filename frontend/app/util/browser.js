/* global window, setTimeout */

import {browserHistory} from 'react-router';

/**
 * Load the specified URL after a delay.
 *
 * @param {String} url The URL to load.
 * @param {Number=} delay Milliseconds to delay the page load.
 */
function go(url, delay) {
  if (!delay || delay <= 0) {
    window.location.href = url;
  } else {
    setTimeout(() => go(url, 0), delay);
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

export default {
  go,
  push
};
