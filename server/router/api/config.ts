import express from 'express'

import { Config } from '../../models/config'
import log from '../../utils/log'

export const router = express.Router()

router.put('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { name } = req.body
		if (!name) {
			return res.fail(400, 'no name provided')
		}

		log.debug(name)

		await Config.set({ name })

		log.info('Config updated')
		res.ok()
	} catch (err) {
		return next(err)
	}
})

router.get('/', async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const config = await Config.get()

		log.debug(config)
		res.ok(config)
	} catch (err) {
		return next(err)
	}
})

export default router