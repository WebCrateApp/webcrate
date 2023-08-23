import express from 'express'

import { Link, TLink, createLink as createLinkDirect } from '../../models/link.js'
import { Crate, createCrate } from '../../models/crate.js'
import { Stat } from '../../models/stats.js'

import log from '../../utils/log.js'
import { parseUrl } from '../../utils/url.js'
import emojis from '../../utils/emojis.js'

import { parsePaginate } from '../../middleware/index.js'
import { createLink } from '../../service/link.js'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { title, url, crate } = req.body
		if (!url) {
			return res.fail(400, 'no url provided')
		}

		log.debug(url)

		const link = await createLink(url, crate, title)

		log.debug(link)
		log.info('Link added')
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

router.post('/bulk', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		type Bookmark = {
			url: string,
			title?: string,
			crate?: string
		}

		const bookmarks: Bookmark[] | undefined = req.body
		if (!bookmarks) return res.fail(400, 'No bookmarks provided')

		const links: TLink[] = []
		for await (const bookmark of bookmarks) {
			if (!bookmark.url) continue

			let crate
			if (bookmark.crate !== undefined) {
				crate = await Crate.findOne({ name: bookmark.crate })
				if (!crate) {
					const emojiKeys = Object.keys(emojis)

					// Try to find a matching emoji based on the bookmark folder name (not very accurate but better than random)
					const icon =
						// See if any icon includes the name
						emojiKeys.find((icon) => icon.includes(bookmark.crate?.toLowerCase() as string)) ||
						// See if the name includes any icon
						emojiKeys.find((icon) => (bookmark.crate?.toLowerCase() as string).includes(icon)) ||
						undefined

					log.debug(icon)
					crate = await createCrate(bookmark.crate, undefined, icon || undefined)
				}
			}

			const parsedUrl = parseUrl(bookmark.url)
			const favicon = new URL(parsedUrl).origin + '/favicon.ico'

			const link = await createLinkDirect(parsedUrl, { title: bookmark.title, icon: favicon }, crate && crate.id)
			links.push(link)
		}

		res.ok(links)
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
		const foundCrate = await Crate.findOne({ id: crateId })
		if (!foundCrate) {
			return res.fail(404, 'crate not found')
		}

		log.info(foundCrate.id)

		const links = await Link.find({ crate: foundCrate.id }, limit, last)
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

		const link = await Link.findOne({ id })
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

		const link = await Link.findOne({ id })
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)

		const allowedChanges = [ 'public', 'meta.title', 'meta.description', 'meta.icon', 'meta.image', 'crate', 'addedWith' ]
		const changes = req.body

		Object.keys(changes).forEach((key) => {
			if (!allowedChanges.includes(key)) {
				return res.fail(400, `key ${ key } can't be modified`)
			}
		})

		await link.update(changes)

		log.info('Link updated')
		res.ok(link)
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

		const link = await Link.findOne({ id })
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