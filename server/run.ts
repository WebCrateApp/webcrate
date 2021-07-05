/* eslint-disable import/first */
import * as runningAt from 'running-at'
import dotenv from 'dotenv'
// import { build, loadNuxt } from 'nuxt'

// import isDev from './utils/isDev'
dotenv.config()

import app from '../server'

const PORT = process.env.PORT || 3000

/**
 * Connect to database and listen to given port
 */
function startServer() {
	try {
		// const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

		/* if (isDev) {
			build(nuxt)
		} */

		app.listen(PORT, () => runningAt.print(PORT))
	} catch (err) {
	// eslint-disable-next-line no-console
		console.log(err)
		process.exit(1)
	}
}

startServer()