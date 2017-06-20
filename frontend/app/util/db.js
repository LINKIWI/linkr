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
  window.localStorage.setItem(KEY_RECENT_LINKS, JSON.stringify(updatedRecentLinks));
}

/**
 * Remove a link from recent history. If the alias does not exist in history, this is a noop.
 *
 * @param {string} alias Alias to remove from recent history.
 */
function removeRecentLink(alias) {
  const recentLinks = getRecentLinks();
  const updatedRecentLinks = recentLinks.filter((existingAlias) => existingAlias !== alias);

  window.localStorage.setItem(KEY_RECENT_LINKS, JSON.stringify(updatedRecentLinks));
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

export default {
  addRecentLink,
  removeRecentLink,
  getRecentLinks
};
