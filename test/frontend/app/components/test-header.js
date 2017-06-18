import React from 'react';
import {mount} from 'enzyme';
import test from 'tape';

import Header from '../../../../frontend/app/components/header';

test('Header renders all link items', (t) => {
  const header = mount(
    <Header />
  );

  t.equal(header.find('.header-link-item').length, 4, 'All header link items are present');
  t.equal(header.find('.menu-icon').length, 1, 'Menu icon is rendered');
  t.equal(header.find('.link-selected').length, 0, 'No link is initially selected');

  t.end();
});

test('Open/close of header menu', (t) => {
  const header = mount(
    <Header />
  );

  t.notOk(header.state().isMenuOpen, 'Menu is not initially open');
  t.equal(header.find('.expanded').length, 0, 'Menu is not expanded');
  header.find('.menu-icon').simulate('click');
  t.ok(header.state().isMenuOpen, 'Menu is open after click');
  t.equal(header.find('.expanded').length, 1, 'Menu is expanded');
  header.find('.menu-icon').simulate('click');
  t.notOk(header.state().isMenuOpen, 'Menu is closed after another click');

  t.end();
});
