/* eslint-disable import/first */
import path from 'path'
import express from 'express'
import * as bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import * as runningAt from 'running-at'
import dotenv from 'dotenv'
dotenv.config()

import routes from './router'
import { routeLog, sendResponse, disableCaching, checkIfSetup, renderMetaTags } from './middleware'
import log from './utils/log'
import { isDev } from './utils/variables'

const app = express()

// Use ejs as view engine
app.set('view engine', 'ejs')
app.set('views', isDev ? 'server/views' : 'build/views')

app.use(routeLog)
app.use(sendResponse)
app.use(checkIfSetup)

app.use(bodyParser.json())
app.use(compression())
app.use(cors())

// Disable caching for /, reference: https://www.notion.so/Turning-off-Caching-on-the-Root-9879ed9411a4486dbeaf4cc57697d610
app.use(disableCaching)

app.use(renderMetaTags)

// Serve Nuxt static files during production
if (process.env.NODE_ENV !== 'development') {
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
if (require.main === module) {
	try {
		const PORT = process.env.PORT || 3000

		app.listen(PORT, () => runningAt.print(PORT))
	} catch (err) {
	// eslint-disable-next-line no-console
		console.log(err)
		process.exit(1)
	}
}

export default app