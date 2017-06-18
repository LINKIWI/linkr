/* global global, document, window */

import jsdom from 'jsdom';
import Raven from 'raven-js';
import sinon from 'sinon';

function setupDom() {
  if (typeof document !== 'undefined') {
    return;
  }

  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = window.navigator;
  global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

  // Raven stub
  sinon.stub(Raven, 'config').returns({install: () => {}});
}

setupDom();
