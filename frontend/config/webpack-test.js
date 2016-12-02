var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../../test/frontend/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../../test/frontend'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /(frontend)\/.+.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
