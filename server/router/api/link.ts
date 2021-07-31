import express from 'express'
import getMetaData from 'metadata-scraper'
import { MetaData } from 'metadata-scraper/lib/types'

import { Link } from '../../models/link'
import { Stat } from '../../models/stats'

import log from '../../utils/log'
import { parseUrl } from '../../utils/url'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { url, crate } = req.body
		if (!url) {
			return res.fail(400, 'no url provided')
		}

		log.debug(url)

		const parsedUrl = parseUrl(url)

		let meta: MetaData | undefined
		try {
			meta = await getMetaData(parsedUrl)
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

router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req.query.limit as string || '20'
		const last = req.query.last as string | undefined

		const links = await Link.find({}, parseInt(limit), last)

		return res.ok(links)
	} catch (err) {
		return next(err)
	}
})

router.get('/orphans', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req.query.limit as string || '20'
		const last = req.query.last as string | undefined

		const links = await Link.find({ crate: 'null' }, parseInt(limit), last)

		log.debug(links)
		res.ok(links)
	} catch (err) {
		return next(err)
	}
})

router.put('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)

		const { redirect, meta, crate } = req.body
		await link.update({
			...(crate && { crate }),
			...(redirect && {
				...(redirect.enabled !== undefined && {
					'redirect.enabled': redirect.enabled,
					...(redirect.enabled === false && { 'redirect.shortCode': '' })
				}),
				...(redirect.shortCode && { 'redirect.shortCode': redirect.shortCode })
			}),
			...(meta && {
				...(meta.title && { 'meta.title': meta.title }),
				...(meta.description && { 'meta.description': meta.description }),
				...(meta.image && { 'meta.image': meta.image })
			})
		})

		const updated = await Link.findById(id)

		log.info('Link updated')
		res.ok(updated)
	} catch (err) {
		return next(err)
	}
})

router.delete('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
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