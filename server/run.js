const runningAt = require('running-at')
const app = require('../index')

const PORT = process.env.PORT || 3000

/**
 * Connect to database and listen to given port
 */
function startServer () {
  try {
    app.listen(PORT, () => runningAt.print(PORT))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    process.exit(1)
  }
}

startServer()
