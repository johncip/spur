const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'assets', 'styles'),
    },
  },

  entry: {
    app: './src/app.js',
    options: './src/options.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      chunks: ['app'],
      template: './src/app.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      chunks: ['options'],
      template: './src/options.html',
    }),
  ],
};
