import express from 'express'

import * as Link from '../../models/link'
import log from '../../utils/log'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response) => {
	const url = req.body.url as string
	if (!url) {
		return res.fail(400, 'no url provided')
	}

	log.debug(url)

	const link = await Link.addLink(url)

	log.debug(link)
	log.info('Link added')
	res.ok(link)
})

router.get('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		const links = await Link.getAllLinks()

		return res.ok(links)
	}

	const link = await Link.getLink(id)
	if (!link) {
		return res.fail(404, 'link not found')
	}

	log.debug(link)
	res.ok(link)
})

router.put('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		return res.fail(400, 'no id provided')
	}

	const link = await Link.getLink(id)
	if (!link) {
		return res.fail(404, 'link not found')
	}

	log.debug(link)

	const { redirect, meta } = req.body
	await Link.updateLink(id, {
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

	const updated = await Link.getLink(id)

	log.info('Link updated')
	res.ok(updated)
})

router.delete('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		return res.fail(400, 'no id provided')
	}

	const link = await Link.getLink(id)
	if (!link) {
		return res.fail(404, 'link not found')
	}

	await Link.deleteLink(id)

	log.info('Link deleted')
	res.ok()
})

export default router