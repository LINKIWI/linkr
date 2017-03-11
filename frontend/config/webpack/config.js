/* global process */
/* eslint-disable no-process-env */

import path from 'path';
import webpack from 'webpack';

import clientOptions from '../../../config/options/client';
import clientSecrets from '../../../config/secrets/client';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  context: path.resolve(__dirname, '../../'),
  entry: {
    bundle: './scripts/client.js'
  },
  output: {
    path: './frontend/static/dist',
    filename: '[name].js'
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
  plugins: [
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
    isProduction && new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
};
