const webpack = require('webpack');

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const absoluteElementsPath = resolve(__dirname, '../../packages/elements/src');
const absoluteElementsCorePath = resolve(__dirname, '../../packages/elements-core/src');
const absoluteElementsDevPortalPath = resolve(__dirname, '../../packages/elements-dev-portal/src');

console.log(absoluteElementsPath);

module.exports = {
  context: resolve(__dirname, '../src'),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@jpmorganchase/elemental': absoluteElementsPath,
      '@jpmorganchase/elemental-core': absoluteElementsCorePath,
      '@jpmorganchase/elemental-dev-portal': absoluteElementsDevPortalPath,
    },
    fallback: {
      stream: false,
      path: false,
      process: require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: '../index.html' }),
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
    }),
  ],
  performance: {
    hints: false,
  },
};
