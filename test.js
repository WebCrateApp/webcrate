require('dotenv').config()
const runningAt = require('running-at')
const app = require('./build/server')

const PORT = process.env.PORT || 3000

/**
 * Connect to database and listen to given port
 */
function startServer () {
  try {
    app.default.listen(PORT, () => runningAt.print(PORT))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    process.exit(1)
  }
}

startServer()
