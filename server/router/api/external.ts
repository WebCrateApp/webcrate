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
		const id = urlObj.pathname.split('/crate/public/')[1]

		if (!id) return res.fail(400, 'no id provided')

		const existing = await ExternalCrate.findById(id)
		if (existing) return res.fail(400, 'crate already exists')

		// Check if the endpoint and crateId is valid
		const data: any = await got.get(`https://${ endpoint }/api/public/crate/${ id }`).json()
		if (data.status !== 200) return res.fail(400, 'external crate returned error')

		// Add the crate to the database
		const crate = await ExternalCrate.create(endpoint, id)
		await crate.refresh()

		// await Stat.addRecentlyUsedCrate(crate.id)

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
			const externalCrates = await ExternalCrate.find({})

			if (externalCrates.count > 0) {

				const crates = await Promise.all(externalCrates.items.map(async (externalCrate: ExternalCrate) => {
					await externalCrate.refresh()
					return externalCrate
				}))

				return res.ok(crates)
			}

			return { count: 0, items: [], last: undefined }
		}

		const crate = await ExternalCrate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		await crate.refresh()

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

		const crate = await ExternalCrate.findById(id)
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		await crate.refresh()

		// await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(crate)
		res.ok(crate)
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