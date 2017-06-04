import ReactDOM from 'react-dom';
import sinon from 'sinon';
import test from 'tape';

test('Client SPA is rendered', (t) => {
  const renderStub = sinon.stub(ReactDOM, 'render');

  require('../../../frontend/scripts/client');

  t.ok(renderStub.called, 'Document is rendered');

  ReactDOM.render.restore();
  t.end();
});
