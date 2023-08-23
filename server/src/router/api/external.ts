import express from 'express'
import got from 'got'

// import { Stat } from '../../models/stats'
import { ExternalCrate, createExternalCrate, refresh } from '../../models/externalCrate.js'
import { parsePaginate } from '../../middleware/index.js'

import log from '../../utils/log.js'

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

		const existing = await ExternalCrate.findOne({ id })
		if (existing) return res.fail(400, 'crate already exists')

		// Check if the endpoint and crateId is valid
		const data: any = await got.get(`https://${ endpoint }/api/public/crate/${ id }`).json()
		if (data.status !== 200) return res.fail(400, 'external crate returned error')

		// Add the crate to the database
		const crate = await createExternalCrate(endpoint, id)
		await refresh(crate)

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

		if (externalCrates.length > 0) {

			// todo: use pagination
			const crates = await Promise.all(externalCrates.map(async (externalCrate) => {
				try {
					await refresh(externalCrate)
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

		const crate = await ExternalCrate.findOne({ id })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		try {
			await refresh(crate)
		} catch (err) {
			log.debug(err)
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

		const externalCrate = await ExternalCrate.findOne({ id })
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