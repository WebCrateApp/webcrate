import express from 'express'

import { Link } from '../../models/link'
import log from '../../utils/log'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { url, crate } = req.body
		if (!url) {
			return res.fail(400, 'no url provided')
		}

		log.debug(url)

		const link = await Link.create(url, crate)

		log.debug(link)
		log.info('Link added')
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
		if (!id) {
			const links = await Link.getAll()

			return res.ok(links)
		}

		const link = await Link.getById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)
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

		const link = await Link.getById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)
		res.ok(link)
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

		const link = await Link.getById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)

		const { redirect, meta, crate } = req.body
		await link.update({
			...(crate && { crate }),
			...(redirect && {
				...(redirect.enabled && { 'redirect.enabled': redirect.enabled }),
				...(redirect.shortCode && { 'redirect.shortCode': redirect.shortCode })
			}),
			...(meta && {
				...(meta.title && { 'meta.title': meta.title }),
				...(meta.description && { 'meta.description': meta.description }),
				...(meta.image && { 'meta.image': meta.image })
			})
		})

		const updated = await Link.getById(id)

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

		const link = await Link.getById(id)
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