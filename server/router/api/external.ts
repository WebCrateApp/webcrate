import express from 'express'
import got from 'got'

// import { Stat } from '../../models/stats'
import { ExternalCrate } from '../../models/externalCrate'

import log from '../../utils/log'

export const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { url } = req.body
		if (!url) {
			return res.fail(400, 'no url provided')
		}

		log.debug(url)

		const urlObj = new URL(url)

		const endpoint = urlObj.host
		const id = urlObj.pathname.split('/crate/public')[1]

		if (!id) return res.fail(400, 'no id provided')

		const existing = await ExternalCrate.findById(id)
		if (existing) return res.fail(400, 'crate already exists')

		const { data } = await got.get(`https://${ endpoint }/api/public/crate/${ id }`).json()

		const crate = await ExternalCrate.create(endpoint, id)

		// await Stat.addRecentlyUsedCrate(crate.id)

		const result = {
			...data,
			endpoint: crate.endpoint,
			addedAt: crate.addedAt
		}

		log.debug(result)
		log.info('Crate added')
		res.ok(result)
	} catch (err) {
		return next(err)
	}
})

router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.id as string
		if (!id) {
			const externalCrates = await ExternalCrate.find({})

			const crates = await Promise.all(externalCrates.map(async (externalCrate: ExternalCrate) => {
				return await externalCrate.refresh()
			}))

			return res.ok(crates)
		}

		const externalCrate = await ExternalCrate.findById(id)
		if (!externalCrate) {
			return res.fail(404, 'crate not found')
		}

		const crate = await externalCrate.refresh()
		if (!crate) {
			return res.fail(404, 'external crate not found')
		}

		// await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(crate)
		res.ok(crate)
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

		const externalCrate = await ExternalCrate.findById(id)
		if (!externalCrate) {
			return res.fail(404, 'crate not found')
		}

		const crate = await externalCrate.refresh()
		if (!crate) {
			return res.fail(404, 'external crate not found')
		}

		// await Stat.addRecentlyUsedCrate(crate.id)

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

		const externalCrate = await ExternalCrate.findById(id)
		if (!externalCrate) {
			return res.fail(404, 'crate not found')
		}

		const { data: links } = await got.get(`https://${ externalCrate.endpoint }/api/public/crate/${ externalCrate.id }/links`).json()

		// await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(links)
		res.ok(links)
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

		const externalCrate = await ExternalCrate.findById(id)
		if (!externalCrate) {
			return res.fail(404, 'crate not found')
		}

		await externalCrate.delete()

		log.info('Crate deleted')
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router