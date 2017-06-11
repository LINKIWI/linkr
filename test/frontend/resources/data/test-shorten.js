import test from 'tape';

import shortenData from '../../../../frontend/resources/data/shorten';

test('Shorten data contains examples domains', (t) => {
  t.ok(shortenData.examples.length > 0, 'Nonzero number of examples');

  t.end();
});
