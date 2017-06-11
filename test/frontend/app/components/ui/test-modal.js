import React from 'react';
import {mount} from 'enzyme';
import test from 'tape';

import Modal from '../../../../../frontend/app/components/ui/modal';

test('Modal rendering', (t) => {
  const modal = mount(
    <Modal>
      content
    </Modal>
  );

  t.equal(modal.find('.modal-container').length, 1, 'Modal container exists');
  t.equal(modal.find('.modal').length, 1, 'Modal content exists');
  t.equal(modal.find('.modal').props().children, 'content', 'Modal children are inside modal');

  t.end();
});

test('Modal can explicitly accept show/hide calls', (t) => {
  const modal = mount(
    <Modal>
      content
    </Modal>
  );

  t.notOk(modal.state().isVisible, 'Modal is initially not visible');
  modal.instance().showModal();
  modal.instance().showModal();
  t.ok(modal.state().isVisible, 'Modal is visible after imperative call');
  modal.instance().hideModal();
  modal.instance().hideModal();
  t.notOk(modal.state().isVisible, 'Modal is hidden after imperative call');

  t.end();
});

test('Modal toggles between visible and not visible', (t) => {
  const modal = mount(
    <Modal>
      content
    </Modal>
  );

  t.notOk(modal.state().isVisible, 'Modal is initially not visible');
  modal.instance().toggleVisibility();
  t.ok(modal.state().isVisible, 'Modal is visible after imperative call');
  modal.instance().toggleVisibility();
  t.notOk(modal.state().isVisible, 'Modal is hidden after imperative call');

  t.end();
});

test('Clicking in modal container hides modal', (t) => {
  const modal = mount(
    <Modal>
      content
    </Modal>
  );

  t.notOk(modal.state().isVisible, 'Modal is initially not visible');
  modal.instance().toggleVisibility();
  t.ok(modal.state().isVisible, 'Modal is visible after imperative call');
  modal.find('.modal-container').simulate('click');
  t.notOk(modal.state().isVisible, 'Modal is hidden after container click');

  t.end();
});
