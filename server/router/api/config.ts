import express from 'express'
import got from 'got'

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

		// Get latest version up on Space and fail gracefully
		let latestVersion = config.version
		try {
			const spaceApp: any = await got.get('https://v1.deta.sh/discovery/apps/webcrate').json()
			if (spaceApp.version) {
				latestVersion = spaceApp.version.slice(1)
			}
		} catch (err) {
			log.fatal(err)
		}

		const result = {
			...config,
			hasUpdate: latestVersion !== config.version,
			latestVersion
		}

		log.debug(result)
		res.ok(result)
	} catch (err) {
		return next(err)
	}
})

router.get('/saw-update', async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const config = await Config.get()

		// Update stored version with current one
		await Config.set({ version: config.version })

		log.debug(config.version)
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router