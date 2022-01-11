import express from 'express'
import got from 'got'

import { Link } from '../models/link'
import { Crate } from '../models/crate'

import { generateSocialImage } from '../service/image'

import log from '../utils/log'
import emojis from '../utils/emojis'

export const router = express.Router()

router.get('/preview/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'Missing crate id')
		}

		const crate = await Crate.findById(id)
		if (!crate) {
			return res.fail(404, 'link not found')
		}

		log.debug(`Generating preview for crate ${ crate.id }`)

		const image = await generateSocialImage(crate.name, crate.description, emojis[crate.icon])

		/* const sec = 60 * 5 // 5 minutes
		res.header('Cache-Control', `public, max-age=${ sec }`) */

		res.header('Content-Type', 'image/png')
		res.send(image)
	} catch (err) {
		console.log(err)
		return next(err)
	}
})

router.get('/:id', async (req: express.Request, res: express.Response) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'Missing link id')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
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

		// Catch can't catch errors thrown during stream so we need this
		stream.on('error', (err) => {
			log.debug(err)

			// Image errors are now handled on the frontend
			// Old: return res.redirect('/missingFavicon.png')
			return res.status(400).end()
		})

		// Instruct browser to cache image
		if (type === 'image') {
			const sec = 60 * 60 * 2 // 2 hours
			res.header('Cache-Control', `public, max-age=${ sec }`)
		} else if (type === 'icon') {
			const sec = 60 * 60 * 24 * 7 * 4 // 1 month
			res.header('Cache-Control', `public, max-age=${ sec }`)
		}

		stream.pipe(res)
	} catch (err) {
		log.debug(err)

		// Image errors are now handled on the frontend
		// Old: return res.redirect('/missingFavicon.png')
		res.status(400).end()
	}
})

export default router