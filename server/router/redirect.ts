import express from 'express'

import log from '../utils/log'
import { getLink } from '../utils/getRedirectLink'

export const router = express.Router()

router.get('/*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.path.replace(/^\/+/, '') as string
		if (!id) {
			return res.redirect('/')
		}

		// Check if path is a shortened link
		const link = await getLink(id)
		if (!link) {
			return next()
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
			title: link.meta?.title ? `${ link.meta.title }` : 'WebCrate Bookmarking Tool',
			provider: link.url,
			image: link.meta?.image || '/banner.png',
			description: 'This URL was shortened by WebCrate, a bookmarking application which let\'s you organize the web.'
		}

		return res.render('redirect.ejs', data)
	} catch (err) {
		return next(err)
	}
})

export default router