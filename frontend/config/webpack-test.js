var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../../test/frontend/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../../test/frontend'),
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    loaders: [
      {
        test: /frontend\/.+\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
};
