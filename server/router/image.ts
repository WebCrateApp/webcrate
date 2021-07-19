import express from 'express'
import got from 'got'

import { Link } from '../models/link'
import log from '../utils/log'

export const router = express.Router()

router.get('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'Missing link id')
		}

		let link = await Link.findById(id)
		if (!link) {
			link = await Link.findByShortCode(id)
			if (!link) {
				return res.fail(404, 'link not found')
			}
		}

		const type = req.query.type || 'image'

		let url
		if (type === 'image') {
			url = link.meta?.image
		} else if (type === 'icon') {
			url = link.meta?.icon
		} else {
			return res.fail(400, 'Invalid type')
		}

		if (!url) {
			return res.fail(400, `link has no ${ type }`)
		}

		log.debug('Getting image')
		const stream = got.stream(url)

		stream.on('end', () => {
			res.end()
		})

		stream.on('error', (err) => {
			log.fatal(err)

			res.fail(500, err.message, `could not get ${ type }`)
		})

		stream.pipe(res)
	} catch (err) {
		return next(err)
	}
})

export default router