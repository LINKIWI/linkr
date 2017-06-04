/* global global, document, window */

import jsdom from 'jsdom';
import sinon from 'sinon';

function setupDom() {
  if (typeof document !== 'undefined') {
    return;
  }

  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = window.navigator;
  global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
}

setupDom();
