const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const absoluteElementsPath = resolve(__dirname, '../../packages/elements/src');
const absoluteElementsCorePath = resolve(__dirname, '../../packages/elements-core/src');

module.exports = {
  context: resolve(__dirname, '../src'),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@jpmorganchase/elemental': absoluteElementsPath,
      '@jpmorganchase/elemental-core': absoluteElementsCorePath,
    },
    fallback: {
      process: require.resolve('process/browser'),
      asserts: require.resolve('assert/')
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true, // Speeds up development builds
        },
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
      asserts: require.resolve('assert/')
    }),
  ],
  performance: {
    hints: false,
  },
};
