const runningAt = require('running-at')
const { build, loadNuxt } = require('nuxt')
const app = require('./server')

const PORT = process.env.PORT || 3000
const isDev = process.env.NODE_ENVIRONMENT !== 'prod'

/**
 * Connect to database and listen to given port
 */
async function startServer () {
  try {
    const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

    if (isDev) {
      build(nuxt)
    }

    app.listen(PORT, () => runningAt.print(PORT))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    process.exit(1)
  }
}

startServer()
