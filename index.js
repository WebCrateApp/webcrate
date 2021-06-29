
const path = require('path')
const express = require('express')
const { Nuxt } = require('nuxt')

const app = express()

app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt', 'dist')))

const config = require('./nuxt.config.js')
const nuxt = new Nuxt(config)
app.use(nuxt.render)

/*
app.use(express.static('dist'))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
}) */

/* app.get('/', (req, res) => {
  res.send('Hello World!')
}) */

module.exports = app
