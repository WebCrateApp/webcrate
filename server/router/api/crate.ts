import express from 'express'

import { Crate } from '../../models/crate'
import { Link } from '../../models/link'
import log from '../../utils/log'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { name, description, icon, public: isPublic } = req.body
		if (!name) {
			return res.fail(400, 'no name provided')
		}

		log.debug(name)

		const crate = await Crate.create(name, description, icon, isPublic)

		log.debug(crate)
		log.info('Crate added')
		res.ok(crate)
	} catch (err) {
		return next(err)
	}
})

router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
		if (!id) {
			const crates = await Crate.find({})

			return res.ok(crates)
		}

		const crate = await Crate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		const links = await Link.findByCrate(crate.id)
		crate.numLinks = links.length

		log.debug(crate)
		res.ok(crate)
	} catch (err) {
		return next(err)
	}
})

router.get('/recent', async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const crates = await Crate.getRecentlyUsed()

		const newCrates = await Promise.all(crates.map(async (crate) => {
			const links = await Link.findByCrate(crate.id)

			return {
				...crate,
				numLinks: links.length
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

		const links = await Link.findByCrate(crate.id)
		crate.numLinks = links.length

		log.debug(crate)
		res.ok(crate)
	} catch (err) {
		return next(err)
	}
})

router.get('/:id/links', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

		log.debug(links)
		res.ok(links)
	} catch (err) {
		return next(err)
	}
})

router.get('/public', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
		if (!id) {
			// Restrict public API to only allow direct querying, no indexing of all crates
			return res.fail(400, 'no id provided')
		}

		const crate = await Crate.findById(id)
		if (!crate || !crate.public) {
			return res.fail(404, 'crate not found')
		}

		log.debug(crate)
		res.ok(crate)
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

		const crate = await Crate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		log.debug(crate)

		const { name, description, icon, public: isPublic } = req.body
		await crate.update({
			...(name && { name }),
			...(description && { description }),
			...(icon && { icon }),
			...(isPublic && { public: isPublic })
		})

		const updated = await Crate.findById(id)

		log.info('Crate updated')
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

		const crate = await Crate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		await crate.delete()

		log.info('Crate deleted')
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router