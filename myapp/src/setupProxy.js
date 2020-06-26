// @ts-ignore-file
// @ts-ignore-start
const express = require('express')
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(express.static('mock'))
  app.use(
    proxy('/_dev_proxy', {
      target: 'http://app.retailo2o.com',
      // target: 'http://testhxlmd.retailo2o.com',
      // target: 'omsneibu.retailo2o.com',
      changeOrigin: true,
      secure: false,
      ws: true,
      pathRewrite: {
        '^/_dev_proxy': '',
      },
    })
  )
}

// @ts-ignore-end
