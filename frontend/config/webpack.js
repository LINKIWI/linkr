var path = require('path');
var webpack = require('webpack');

var plugins = [];
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments: false
  }));
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }));
}

module.exports = {
  entry: path.resolve(__dirname, '../scripts/client.js'),
  output: {
    path: path.resolve(__dirname, '../static/dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /frontend\/.+\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: plugins,
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
};
