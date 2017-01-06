/* global window, setTimeout */

function go(url, delay) {
  if (delay <= 0) {
    window.location.href = url;
  } else {
    setTimeout(() => go(url, 0), delay);
  }
}

export default {
  go
};
