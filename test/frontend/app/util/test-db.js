/* global window */

import test from 'tape';

import db from '../../../../frontend/app/util/db';

test('Ability to add and remove items to local history', (t) => {
  t.deepEqual(db.getRecentLinks(), [], 'History is initially empty');
  db.addRecentLink('alias');
  t.deepEqual(db.getRecentLinks(), ['alias'], 'History reflects added alias');
  db.addRecentLink('alias-2');
  t.deepEqual(db.getRecentLinks(), ['alias-2', 'alias'],
    'History is sorted reverse chronologically');
  db.addRecentLink('alias');
  t.deepEqual(db.getRecentLinks(), ['alias', 'alias-2'],
    'Duplicate elements are not allowed; only reordered in-place');
  db.removeRecentLink('alias');
  t.deepEqual(db.getRecentLinks(), ['alias-2'], 'Can remove link');

  t.end();
});

test('Graceful failure if setItem throws', (t) => {
  const originalLocalStorage = window.localStorage;
  window.localStorage = {
    setItem() {
      throw new Error();
    },

    getItem() {}
  };

  db.addRecentLink('alias');
  t.pass('Graceful failure on setItem error');

  window.localStorage = originalLocalStorage;
  t.end();
});
