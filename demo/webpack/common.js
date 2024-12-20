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
      stream: false, // Remove if not used
      path: false, // Remove if not used
      process: require.resolve('process/browser'),
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
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../index.html'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser', // Provide process globally
    }),
  ],
  performance: {
    hints: false, // Disable in development; enable in production for bundle analysis
  },
};
