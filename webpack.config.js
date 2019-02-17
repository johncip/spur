const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'assets', 'styles'),
    },
  },

  entry: {
    app: './src/app.jsx',
    options: './src/options.jsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    }],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'assets/*.json', to: '[name].[ext]' },
      { from: 'assets/images/*.png', to: '[name].[ext]' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      chunks: ['app'],
      template: './src/template.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      chunks: ['options'],
      template: './src/template.html',
    }),
    new GoogleFontsPlugin({
      fonts: [
        { family: 'Work Sans', variants: ['300', '400', '500'] },
        { family: 'Staatliches', variants: ['400'], subsets: ['latin'] },
        { family: 'PT Mono', variants: ['400'] },
        { family: 'Overpass Mono', variants: ['300', '400'] },
      ],
      formats: ['woff2'],
    }),
  ],
}
