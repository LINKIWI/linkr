/* global process */
/* eslint-disable no-process-env */

const path = require('path');
const webpack = require('webpack');

const clientOptions = require('../../../config/options/client');
const clientSecrets = require('../../../config/secrets/client');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    bundle: './scripts/client.js'
  },
  output: {
    path: path.resolve(__dirname, '../../static/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
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
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      config: JSON.stringify({
        options: clientOptions,
        secrets: clientSecrets
      }),
      ...(isProduction && {
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    }),
    isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
    isProduction && new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    isProduction && new webpack.optimize.UglifyJsPlugin({
      comments: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      // Don't bundle Raven if Sentry isn't used; alias it to a dummy import that's already included
      'raven-js': clientSecrets.sentry_client_dsn ? 'raven-js' : 'react'
    }
  }
};
