import React from 'react';
import {mount} from 'enzyme';
import test from 'tape';

import Container from '../../../../frontend/app/components/container';

test('Basic container rendering', (t) => {
  const container = mount(
    <Container>
      children
    </Container>
  );

  t.equal(container.find('.container').length, 1, 'Container is present');
  t.equal(container.find('.container').props().children, 'children', 'Children are propagated');

  t.end();
});
