/* global window */

const KEY_RECENT_LINKS = 'recent-links';

/**
 * Add a recent link. If this alias already exists in the local cache of recent links, that entry
 * will simply be relocated to the head of the array.
 *
 * @param {string} alias Alias to add as a recent link.
 */
function addRecentLink(alias) {
  // Removing the alias followed by pushing it to the end of the array has the effect of bringing
  // a previously-accessed alias to the head of the recent links array.
  removeRecentLink(alias);
  const recentLinks = getRecentLinks();
  const updatedRecentLinks = recentLinks.concat(alias);

  setItem(KEY_RECENT_LINKS, JSON.stringify(updatedRecentLinks));
}

/**
 * Remove a link from recent history. If the alias does not exist in history, this is a noop.
 *
 * @param {string} alias Alias to remove from recent history.
 */
function removeRecentLink(alias) {
  const recentLinks = getRecentLinks();
  const updatedRecentLinks = recentLinks.filter((existingAlias) => existingAlias !== alias);

  setItem(KEY_RECENT_LINKS, JSON.stringify(updatedRecentLinks));
}

/**
 * Get an array of recent links. Earlier elements are more recently accessed.
 *
 * @returns {Array} Aliases in the most-recently-accessed order according to local history.
 */
function getRecentLinks() {
  const value = window.localStorage.getItem(KEY_RECENT_LINKS);
  const recentLinks = value ? JSON.parse(value) : [];
  return recentLinks.reverse().filter(Boolean);
}

/**
 * Wrapper over localStorage.setItem to gracefully fail on errors.
 *
 * @param {String} key Local storage item key.
 * @param {String} value Local storage item value for this key.
 */
function setItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    // Though localStorage and setItem are defined, some browsers will throw on every invocation if
    // the client has disallowed storage of any persistent data.
    // It's safe to noop here since these functions have no other side effects.
  }
}

/**
 * Execute the specified function only if window.localStorage is defined; otherwise, noop.
 *
 * @param {Function} func Function to safely wrap.
 * @returns {Function} Either the original function if window.localStorage is defined; otherwise, a
 *                     noop function.
 */
function withLocalStorage(func) {
  return window.localStorage ? func : () => {};
}

export default {
  addRecentLink: withLocalStorage(addRecentLink),
  removeRecentLink: withLocalStorage(removeRecentLink),
  getRecentLinks: withLocalStorage(getRecentLinks)
};
