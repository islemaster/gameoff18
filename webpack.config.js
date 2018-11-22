'use strict'

const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',

  module: {
    rules: [{
      test: [/\.vert$/, /\.frag$/],
      use: 'raw-loader'
    },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      }
    ]
  },

  devServer: {
    disableHostCheck: true,
    watchContentBase: true,
    hot: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'project.bundle.js'
  },

}
