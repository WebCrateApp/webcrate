import express from 'express'

import log from '../utils/log'
import { isValidUrl } from '../utils/isValidUrl'

export const router = express.Router()

router.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const url = req.path.replace(/^\/+/, '') as string
		if (!url || !isValidUrl(url)) {
			return next()
		}

		log.debug(url)

		res.redirect(`/?addUrl=${ url }`)
	} catch (err) {
		return next(err)
	}
})

export default router