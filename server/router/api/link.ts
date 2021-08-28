import express from 'express'
import getMetaData from 'metadata-scraper'
import { MetaData } from 'metadata-scraper/lib/types'

import { Link } from '../../models/link'
import { Crate } from '../../models/crate'
import { Stat } from '../../models/stats'

import log from '../../utils/log'
import { parseUrl } from '../../utils/url'
import { parsePaginate } from '../../middleware'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { title, url, crate } = req.body
		if (!url) {
			return res.fail(400, 'no url provided')
		}

		log.debug(url)

		const parsedUrl = parseUrl(url)

		let meta: MetaData | undefined
		try {
			// Workaround to Twitter to include the right meta tags
			const useGoogleUa = parsedUrl.includes('twitter.com')

			meta = await getMetaData(parsedUrl, {
				...(useGoogleUa && { ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' })
			})

			// Add title to meta object
			if (title) meta.title = title
		} catch (err) {
			log.debug(err)
		}

		const link = await Link.create(parsedUrl, meta, crate)

		await Stat.addRecentlyAddedLink(link.id)

		if (crate) {
			await Stat.addRecentlyUsedCrate(crate)
		}

		log.debug(link)
		log.info('Link added')
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

router.get('/', parsePaginate, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req?.paginate?.limit
		const last = req?.paginate?.last
		const crateId = req.query.crate as string | undefined

		// Get all links
		if (!crateId) {
			const links = await Link.find({}, limit, last)

			return res.ok(links)
		}

		// Get orphaned links
		if (crateId === 'null' || crateId === 'inbox') {
			const links = await Link.find({ crate: 'null' }, limit, last)

			log.debug(links)
			return res.ok(links)
		}

		// Check if crate exists
		const foundCrate = await Crate.findById(crateId)
		if (!foundCrate) {
			return res.fail(404, 'crate not found')
		}

		log.info(foundCrate.id)

		const links = await Link.findByCrate(foundCrate.id, limit, last)
		await Stat.addRecentlyUsedCrate(foundCrate.id)

		log.debug(links)
		res.ok(links)

	} catch (err) {
		return next(err)
	}
})

router.get('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

router.put('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)

		const allowedChanges = [ 'redirect.enabled', 'redirect.shortCode', 'meta.title', 'meta.description', 'meta.icon', 'meta.image', 'crate', 'addedWith' ]
		const changes = req.body

		Object.keys(changes).forEach((key) => {
			if (!allowedChanges.includes(key)) {
				return res.fail(400, `key ${ key } can't be modified`)
			}
		})

		await link.update(changes)

		const updated = await Link.findById(id)

		log.info('Link updated')
		res.ok(updated)
	} catch (err) {
		return next(err)
	}
})

router.delete('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		await link.delete()

		log.info('Link deleted')
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router