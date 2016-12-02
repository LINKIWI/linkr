/* global document */

import range from 'range';

/**
 * Given a DOM subtree of the form
 *
 *   <div>
 *     <div id="ID" class="className">content</div>
 *   </div>
 *
 * this function will build a map for a specified className mapping IDs (ID) to their elements'
 * inner contents (contents). For the tree above, a call to this function with input parameter
 * 'className' would return
 *
 *   {
 *     ID: 'content'
 *   }
 *
 * @param className Name of the class attached to elements of this type.
 * @returns {Object} Map from each DOM element's ID to their inner HTML contents as a string.
 */
function buildIDValueMap(className) {
  const nodes = document.getElementsByClassName(className);
  return range
    .range(0, nodes.length)
    .map((idx) => nodes[idx])
    .reduce((idValueMap, node) => {
      idValueMap[node.id] = node.innerText;
      return idValueMap;
    }, {});
}

export default {
  uris: buildIDValueMap('uri'),
  config: buildIDValueMap('config-option')
};
