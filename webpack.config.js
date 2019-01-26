/* global __dirname, module */

'use strict'

var pathModule = require("path");
var webpack = require('webpack');
var env = process.env.NODE_ENV

var config = {
  module: {
    loaders: [
      {
        test    : /\.jsx?$/u,
        use     : ["babel-loader"],
        include : pathModule.join(__dirname, "lib"),
      },
    ]
  },
  output: {
    library: 'ReactPaginator',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development"),
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "BABEL_ENV": JSON.stringify("developmentTime"),
      },
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "BABEL_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ro/),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
    }),
  )
}

module.exports = config
