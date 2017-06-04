/* global document */

import test from 'tape';

import {buildIDValueMap} from '../../../../frontend/app/util/context';

test('String ID value map from class name', (t) => {
  const node = document.createElement('div');
  node.id = 'id';
  node.className = 'class';
  node.innerText = 'content';
  document.body.appendChild(node);

  t.deepEqual(buildIDValueMap('class'), {id: 'content'}, 'Map is built for a defined class name');
  t.deepEqual(buildIDValueMap(''), {}, 'Map is empty if no class names match');

  t.end();
});

test('Boolean conversion during value map construction', (t) => {
  const trueNode = document.createElement('div');
  trueNode.id = 'true-id';
  trueNode.className = 'boolean-class';
  trueNode.innerText = 'True';
  document.body.appendChild(trueNode);

  const falseNode = document.createElement('div');
  falseNode.id = 'false-id';
  falseNode.className = 'boolean-class';
  falseNode.innerText = 'False';
  document.body.appendChild(falseNode);

  t.deepEqual(buildIDValueMap('boolean-class'), {'true-id': true, 'false-id': false},
    'Map is built for a defined class name');

  t.end();
});
