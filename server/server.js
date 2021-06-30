const path = require('path')
const express = require('express')

const routes = require('./router')

const app = express()

// Server Nuxt static files
app.use(express.static(path.join(__dirname, '../dist')))

// API routes
app.use(routes)

// Redirect to Nuxt SPA
app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

module.exports = app
