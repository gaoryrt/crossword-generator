const express = require('express')
const webpack = require('webpack')
const wdm = require('webpack-dev-middleware')
const whm = require('webpack-hot-middleware')
const config = require('./webpack.dev.js')
const getPort = require('get-port')
const address = require('address')
const FriendlyErrors = require('friendly-errors-webpack-plugin')

const app = express()

config.entry.push('webpack-hot-middleware/client?reload=true')

;(async () => {
  const port = await getPort({port: 4000, host: '0.0.0.0'})

  config.plugins.push(new FriendlyErrors({
    compilationSuccessInfo: {
      messages: [
        `\thttp://localhost:${port}`,
        `\thttp://${address.ip()}:${port}`
      ]
    }
  }))
  
  const compiler = webpack(config)

  app.use(
    wdm(compiler, {
      publicPath: '/',
      stats: 'errors-only',
      logLevel: 'silent'
    })
  )

  app.use(
    whm(compiler, {log: false})
  )

  app.listen(port)
})()
