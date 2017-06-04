import fs from 'fs';
import test from 'tape';

test('Index template inlines CSS and JS', (t) => {
  const template = fs.readFileSync('frontend/templates/index.html', 'utf8');

  t.ok(template.indexOf('<style') !== -1, 'Template contains style tag');
  t.ok(template.indexOf('<script') !== -1, 'Template contains script tag');

  t.end();
});

test('Index template server-renders URIs and config', (t) => {
  const template = fs.readFileSync('frontend/templates/index.html', 'utf8');

  t.ok(template.indexOf('id="uris"') !== -1, 'Template contains URIs');
  t.ok(template.indexOf('id="config"') !== -1, 'Template contains server-side config');

  t.end();
});
