const merge = require('webpack-merge')
const base = require('./webpack.base.js')
const CleanWbpk = require('clean-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const FriendlyErrors = require('friendly-errors-webpack-plugin')


module.exports = merge(base, {
  entry: ['./src/App.js'],
  output: {
    libraryTarget: 'commonjs2',
    filename: 'crossword-generator.min.js'
  },
  mode: 'production',
  stats: {
    timings: false,
    builtAt: false,
    children: false,
    entrypoints: false,
    hash: false,
    modules: false
  },
  optimization: {

    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        extractComments: false
      }),

    ]
  },
  plugins: [
    new FriendlyErrors(),
    new CleanWbpk(['../dist'], {
      allowExternal: true,
      verbose: false
    }),

  ],

})