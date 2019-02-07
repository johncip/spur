const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const WebpackWebExt = require('webpack-webext-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');

module.exports = {
  mode: 'production',

  node: {
    global: false,
  },

  devtool: false,

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

  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'assets/*.json', to: '[name].[ext]' },
      { from: 'assets/images/*.png', to: '[name].[ext]' }
    ]),
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
    new GoogleFontsPlugin({
      fonts: [
        { family: 'Zilla Slab', variants: ['300'] },
      ],
      formats: ['woff2'],
    }),
    // new WebpackWebExt({
    //   runOnce: true,
    //   maxRetries: 0,
    //   argv: ["run", "-s", "dist/"],
    // })
  ],
};
