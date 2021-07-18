import express from 'express'

import { Link } from '../models/link'
import log from '../utils/log'
import { isValidUrl } from '../utils/isValidUrl'

export const router = express.Router()

router.get('*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const path = req.path.replace(/^\/+/, '') as string

		if (!path) return next()

		// Check if url is a shortened url
		let link = await Link.findById(path)
		if (!link) {
			link = await Link.findByShortCode(path)

			// Link is no short url, check if it's a valid url to add
			if (!link) {
				const url = path
				if (!isValidUrl(url)) {
					return next()
				}

				log.debug(url)

				return res.redirect(`/?addUrl=${ url }`)
			}
		}

		if (!link.redirect.enabled) {
			return res.fail(404, 'link not found')
		}

		log.info(`Redirecting ${ link.id } to ${ link.url }`)

		res.redirect(link.url)
	} catch (err) {
		return next(err)
	}
})

export default router