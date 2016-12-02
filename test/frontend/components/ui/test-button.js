import React from 'react';
import {mount} from 'enzyme';
import test from 'tape';

import Button from '../../../../frontend/app/components/ui/button';

test('Button rendering', (t) => {
  const button = mount(
    <Button />
  );

  console.log(button);

  t.end();
});
