import express from 'express'

import { Link } from '../models/link'
import log from '../utils/log'
import { isValidUrl } from '../utils/isValidUrl'

export const router = express.Router()

router.get('*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const url = req.originalUrl.split('/n/')[1] as string
		if (!url || !isValidUrl(url)) {
			return res.redirect('/')
		}

		log.debug(url)

		const link = await Link.create(url)

		log.debug(link)
		log.info('Link added')
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

export default router