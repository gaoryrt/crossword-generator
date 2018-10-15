const merge = require('webpack-merge')
const base = require('./webpack.base')
const webpack = require('webpack')
const HtmlWbpk = require('html-webpack-plugin')

module.exports = merge(base, {
  output: {
    filename: 'js/[name].js'
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new HtmlWbpk({
      template: 'public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
})
