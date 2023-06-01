/* eslint-disable import/first */
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import routes from './router/index.js'
import actions from './router/actions.js'
import { routeLog, sendResponse, disableCaching, checkIfSetup, renderMetaTags } from './middleware/index.js'
import log from './utils/log.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.set('view engine', 'ejs')
app.set('views', isDev ? 'server/views' : 'build/views')

app.use(express.json())
app.use(routeLog)
app.use(actions.middleware)
app.use(sendResponse)
app.use(checkIfSetup)

app.use(compression())
app.use(cors())

// Disable caching for /, reference: https://www.notion.so/Turning-off-Caching-on-the-Root-9879ed9411a4486dbeaf4cc57697d610
app.use(disableCaching)

app.use(renderMetaTags)

// Serve Nuxt static files during production
if (!isDev) {
	app.use(express.static(path.join(__dirname, '../dist')))
}

// Use router
app.use(routes)

// Redirect to Nuxt SPA
app.get('*', (_req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		next()
		return
	}

	res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!err) {
		return next()
	}

	let returnStatus
	let message = err.message || 'An unkown error ocurred, please try again.'
	if (err.name === 'HTTPError') {
		log.warn('Metdata parsing failed: ' + err.message)
		returnStatus = 500
		message = 'Could not get metadata for url'
	} else {
		log.fatal(err)
		returnStatus = typeof err === 'number' ? err : 400
	}

	res.fail(returnStatus, err.message, message)
})

// Start the server if file is directly run
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	try {
		const PORT = process.env.PORT || 8080

		app.listen(PORT, () => console.log(`Listening on port ${ PORT }`))
	} catch (err) {
	// eslint-disable-next-line no-console
		console.log(err)
		process.exit(1)
	}
}

export default app