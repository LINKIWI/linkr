import {db} from '../app';

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
  db.get(KEY_RECENT_LINKS).push(alias).write();
}

/**
 * Remove a link from recent history. If the alias does not exist in history, this is a noop.
 *
 * @param {string} alias Alias to remove from recent history.
 */
function removeRecentLink(alias) {
  const recentLinks = getRecentLinks();
  const updatedRecentLinks = recentLinks.filter((existingAlias) => existingAlias !== alias);

  db.set(KEY_RECENT_LINKS, updatedRecentLinks).write();
}

/**
 * Get an array of recent links. Earlier elements are more recently accessed.
 *
 * @returns {Array} Aliases in the most-recently-accessed order according to local history.
 */
function getRecentLinks() {
  return (db.get(KEY_RECENT_LINKS).value() || []).reverse().filter(Boolean);
}

export default {
  addRecentLink,
  removeRecentLink,
  getRecentLinks
};
