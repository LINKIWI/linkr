import test from 'tape';

import apiData from '../../../../frontend/resources/api/data';

test('API data contains array of endpoints', (t) => {
  t.ok(apiData.endpoints.length > 0, 'Nonzero number of endpoints');

  apiData.endpoints.forEach((endpoint) => {
    t.ok(endpoint.meta, 'Endpoint meta field');
    t.ok(endpoint.meta, 'Endpoint details field');
  });

  t.end();
});
