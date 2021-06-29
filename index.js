const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/test', (_req, res) => {
  res.send('Hello World')
})

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

module.exports = app
