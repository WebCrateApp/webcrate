import express from 'express'

import { Crate } from '../../models/crate'
import { Link } from '../../models/link'

import log from '../../utils/log'
import { parsePaginate } from '../../middleware'

export const router = express.Router()

router.get('/crate/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'Missing required parameter: id')
		}

		const crate = await Crate.findOne({ id: id, public: true })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		log.debug(crate)
		res.ok(crate)
	} catch (err) {
		return next(err)
	}
})

router.get('/link', parsePaginate, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.query.crate as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const crate = await Crate.findOne({ id: id, public: true })
		if (!crate) {
			return res.fail(404, 'crate not found')
		}

		const limit = req?.paginate?.limit
		const last = req?.paginate?.last

		const links = await Link.findByCrate(crate.id, limit, last)

		log.debug(links)
		res.ok(links)
	} catch (err) {
		return next(err)
	}
})

router.get('/link/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const id = req.params.id as string
		if (!id) {
			return res.fail(400, 'no id provided')
		}

		const link = await Link.findById(id)
		if (!link) {
			return res.fail(404, 'link not found')
		}

		if (!link.crate) {
			return res.fail(404, 'link not found')
		}

		const crate = await Crate.findById(link.crate)
		if (!crate || crate.public !== true) {
			return res.fail(404, 'link not found')
		}

		log.debug(link)
		res.ok(link)
	} catch (err) {
		return next(err)
	}
})

export default router