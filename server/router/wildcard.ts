import express from 'express'

import { Link } from '../models/link'
import log from '../utils/log'
import { isValidUrl } from '../utils/isValidUrl'

export const router = express.Router()

const getLink = async (path: string) => {
	let link = await Link.findById(path)
	if (!link) {
		link = await Link.findByShortCode(path)

		if (!link) return undefined
	}

	return link
}

router.get('*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const path = req.path.replace(/^\/+/, '') as string

		if (!path) return next()

		// Check if path is a shortened link
		const link = await getLink(path)

		// If link is no short url, check if it's a valid url to add
		if (!link) {
			const url = path
			if (!isValidUrl(url)) {
				return next()
			}

			log.debug(url)

			return res.redirect(`/?addUrl=${ url }`)
		}

		// If redirect is disabled, return 404
		if (!link.redirect.enabled) {
			return next()
		}

		log.info(`Redirecting ${ link.id } to ${ link.url }`)

		const data = {
			url: link.url,
			code: link.id,
			metaAvailable: link.meta?.title !== undefined,
			title: link.meta?.title ? `${ link.meta.title }` : 'Short URL by QrGen.cc',
			provider: link.url,
			image: link.meta?.image || '/banner.png',
			description: link.meta?.description ? link.meta.description : 'This URL was shortened by WebCrate, a bookmarking application which let\'s you organize the web.'
		}

		return res.render('redirect.ejs', data)
		// res.redirect(link.url)
	} catch (err) {
		return next(err)
	}
})

export default router