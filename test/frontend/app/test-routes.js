import test from 'tape';

import Routes from '../../../frontend/app/routes';

test('Client-side routes are defined', (t) => {
  t.equal(Routes.props.path, '', 'Root element is an empty path');
  t.ok(Routes.props.children.length > 0, 'Root element has multiple children paths');

  t.end();
});
