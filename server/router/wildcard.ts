import express from 'express'

import log from '../utils/log'
import { isValidUrl } from '../utils/url'

export const router = express.Router()

router.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const path = req.path.replace(/^\/+/, '') as string

		if (!path) return next()

		const url = path
		if (!isValidUrl(url)) {
			return next()
		}

		log.debug(url)

		return res.redirect(`/?addUrl=${ url }`)
	} catch (err) {
		return next(err)
	}
})

export default router