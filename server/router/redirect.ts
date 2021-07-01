import express from 'express'

import { Link } from '../models/link'
import log from '../utils/log'

export const router = express.Router()

router.get('/:id', async (req: express.Request, res: express.Response) => {
	const id = req.params.id as string
	if (!id) {
		return res.redirect('/')
	}

	let link = await Link.getById(id)
	if (!link) {
		link = await Link.getByShortCode(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}
	}

	if (!link.redirect.enabled) {
		return res.fail(404, 'link not found')
	}

	log.info(`Redirecting ${ link.key } to ${ link.url }`)

	res.redirect(link.url)
})

export default router