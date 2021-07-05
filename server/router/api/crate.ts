import express from 'express'

import { Crate } from '../../models/crate'
import log from '../../utils/log'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response) => {
	const name = req.body.name as string
	const icon = req.body.icon as string
	if (!name) {
		return res.fail(400, 'no name provided')
	}

	log.debug(name)

	const crate = await Crate.create(name, icon)

	log.debug(crate)
	log.info('Crate added')
	res.ok(crate)
})

router.get('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		const crates = await Crate.getAll()

		return res.ok(crates)
	}

	const crate = await Crate.getById(id)
	if (!crate) {
		return res.fail(404, 'crate not found')
	}

	log.debug(crate)
	res.ok(crate)
})

router.get('/public', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		// Restrict public API to only allow direct querying, no indexing of all crates
		return res.fail(400, 'no id provided')
	}

	const crate = await Crate.getById(id)
	if (!crate || !crate.public) {
		return res.fail(404, 'crate not found')
	}

	log.debug(crate)
	res.ok(crate)
})

router.put('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		return res.fail(400, 'no id provided')
	}

	const crate = await Crate.getById(id)
	if (!crate) {
		return res.fail(404, 'crate not found')
	}

	log.debug(crate)

	const { public: isPublic, name, icon } = req.body
	await crate.update({
		...(name && { name }),
		...(icon && { icon }),
		...(isPublic && { public: isPublic })
	})

	const updated = await Crate.getById(id)

	log.info('Crate updated')
	res.ok(updated)
})

router.delete('/', async (req: express.Request, res: express.Response) => {
	const id = req.query.id as string
	if (!id) {
		return res.fail(400, 'no id provided')
	}

	const crate = await Crate.getById(id)
	if (!crate) {
		return res.fail(404, 'crate not found')
	}

	await crate.delete()

	log.info('Crate deleted')
	res.ok()
})

export default router