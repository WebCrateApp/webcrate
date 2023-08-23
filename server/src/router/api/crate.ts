import express from 'express'

import { Crate, createCrate, findByIds } from '../../models/crate.js'
import { Link } from '../../models/link.js'
import { Stat } from '../../models/stats.js'

import log from '../../utils/log.js'
import { parsePaginate } from '../../middleware/index.js'
import externalRouter from './external.js'

export const router = express.Router()

router.use('/external', externalRouter)

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { name, description, icon, public: isPublic } = req.body
		if (!name) {
			return res.fail(400, 'no name provided')
		}

		log.debug(name)

		const crate = await createCrate(name, description, icon, isPublic)

		await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(crate)
		log.info('Crate added')
		res.ok(crate)
	} catch (err) {
		return next(err)
	}
})

router.get('/', parsePaginate, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req?.paginate?.limit
		const last = req?.paginate?.last

		const crates = await Crate.find({}, limit, last)

		return res.ok(crates)
	} catch (err) {
		return next(err)
	}
})

router.get('/recent', async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const crateIds = await Stat.getRecentlyUsedCrateIds()
		if (!crateIds) {
			return res.ok([])
		}

		const crates = await findByIds(crateIds)

		const newCrates = await Promise.all(crates.map(async (crate) => {
			const links = await Link.find({ crate: crate.id })

			return {
				...crate,
				numLinks: links.length // todo: use actual count value coming from Base
			}
		}))

		log.debug(newCrates)
		res.ok(newCrates)
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

		const crate = await Crate.findOne({ id })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(crate)
		res.ok(crate)
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

		const crate = await Crate.findOne({ id })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		log.debug(crate)

		const { name, description, icon, public: isPublic, showImages } = req.body
		await crate.update({
			...(name && { name }),
			...(description && { description }),
			...(icon && { icon }),
			...(isPublic !== undefined && { public: isPublic }),
			...(showImages !== undefined && { showImages })
		})

		log.info('Crate updated')
		res.ok(crate)
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

		const crate = await Crate.findOne({ id })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		const links = await Link.find({ crate: crate.id })

		if (links.length > 0) {
			for await (const link of links) {
				await link.delete()
			}
		}

		log.debug('All related links deleted')

		await crate.delete()

		log.info('Crate deleted')
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router