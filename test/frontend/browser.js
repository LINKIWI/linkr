/* global global, document, window */

import jsdom from 'jsdom';
import Raven from 'raven-js';
import sinon from 'sinon';
import StorageShim from 'node-storage-shim';

function setupDom() {
  if (typeof document !== 'undefined') {
    return;
  }

  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.window.localStorage = new StorageShim();
  global.navigator = window.navigator;
  global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

  // Raven stub
  sinon.stub(Raven, 'config').returns({install: () => {}});
}

setupDom();
