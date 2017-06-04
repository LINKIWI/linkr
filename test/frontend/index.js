require('babel-core/register');

// Noop on txt requires, namely for font resources
require.extensions['.txt'] = () => {};

// This global is set via Webpack but is unavailable in a Node environment, so we'll stub it here
config = {};  // eslint-disable-line no-undef

module.exports = require('./main');
