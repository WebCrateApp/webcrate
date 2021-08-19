import express from 'express'
import got from 'got'

// import { Stat } from '../../models/stats'
import { ExternalCrate } from '../../models/externalCrate'
import { parsePaginate } from '../../middleware'

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

router.get('/', parsePaginate, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req?.paginate?.limit
		const last = req?.paginate?.last

		const externalCrates = await ExternalCrate.find({}, limit, last)

		if (externalCrates.count > 0) {

			const crates = await Promise.all(externalCrates.items.map(async (externalCrate: ExternalCrate) => {
				try {
					await externalCrate.refresh()
					return externalCrate
				} catch (err) {
					return { ...externalCrate, deleted: true }
				}
			}))

			return res.ok(crates)
		}

		res.ok([])
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

		try {
			await crate.refresh()
		} catch (err) {
			return res.ok({ ...crate, deleted: true })
		}

		// await Stat.addRecentlyUsedCrate(crate.id)

		log.debug(crate)
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