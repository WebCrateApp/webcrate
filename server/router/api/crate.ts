import express from 'express'

import { Crate } from '../../models/crate'
import { Link } from '../../models/link'
import { Stat } from '../../models/stats'

import log from '../../utils/log'
import { parsePaginate } from '../../middleware'
import externalRouter from './external'

export const router = express.Router()

router.use('/external', externalRouter)

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { name, description, icon, public: isPublic } = req.body
		if (!name) {
			return res.fail(400, 'no name provided')
		}

		log.debug(name)

		const crate = await Crate.create(name, description, icon, isPublic)

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

		const crates = await Crate.findByIds(crateIds)

		const newCrates = await Promise.all(crates.map(async (crate) => {
			const links = await Link.findByCrate(crate.id)

			return {
				...crate,
				numLinks: links.count
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

		const crate = await Crate.findById(id)
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

		const crate = await Crate.findById(id)
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

		const updated = await Crate.findById(id)

		log.info('Crate updated')
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

		const crate = await Crate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		const links = await Link.findByCrate(crate.id)

		if (links.count > 0) {
			for await (const link of links.items) {
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