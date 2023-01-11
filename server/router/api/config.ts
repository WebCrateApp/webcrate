import express from 'express'
import got from 'got'

import { Config } from '../../models/config'
import log from '../../utils/log'
import { version, latestReleaseUrl } from '../../utils/variables'

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
		// let latestVersion = config.version
		// try {
		// 	const spaceApp: any = await got.get(latestReleaseUrl).json()
		// 	if (spaceApp.release.version) {
		// 		latestVersion = spaceApp.release.version
		// 	}
		// } catch (err) {
		// 	log.fatal(err)
		// }

		const isSetup = () => {
			const env = process.env.OVERWRITE_IS_SETUP

			if (env !== undefined) {
				return env === 'true'
			}

			if (!config || !config.name) {
				return false
			}

			return true
		}

		const result = {
			...config,
			hasUpdate: false,
			isSetup: isSetup()
			// latestVersion
		}

		log.debug(result)
		res.ok(result)
	} catch (err) {
		return next(err)
	}
})

router.get('/saw-update', async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		// Update stored version with current one
		await Config.set({ version: version })

		log.debug(version)
		res.ok()
	} catch (err) {
		return next(err)
	}
})

export default router