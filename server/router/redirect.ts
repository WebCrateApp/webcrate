import express from 'express'

import { Link } from '../models/link'
import log from '../utils/log'

export const router = express.Router()

router.get('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.redirect('/')
		}

		let link = await Link.findById(id)
		if (!link) {
			link = await Link.findByShortCode(id)
			if (!link) {
				return res.fail(404, 'link not found')
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