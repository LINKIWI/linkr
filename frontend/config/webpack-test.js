var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../test/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist-test'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /(src|test)\/.+.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
