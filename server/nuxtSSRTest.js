const { Nuxt } = require('nuxt')

const express = require('express')
const app = express()

const config = {
  dev: false,
  buildDir: 'nuxt',
  build: {
    publicPath: '/'
  }
}

const nuxt = new Nuxt(config) // await loadNuxt(isDev ? 'dev' : 'start')

// Render every route with Nuxt.js

// app.use('/_nuxt', express.static(path.join(__dirname, 'nuxt', 'dist')))

app.get('/test', (_req, res) => {
  res.send('Hello World')
})

app.use(nuxt.render)

// Build only in dev mode with hot-reloading
/* if (isDev) {
  build(nuxt)
} */

module.exports = app
