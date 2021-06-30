import express from 'express'

import * as Link from '../models/link'
import log from '../utils/log'

export const router = express.Router()

router.post('/link', async (req: express.Request, res: express.Response) => {
	const url = req.body.url as string
	if (!url) {
		return res.fail('no url provided', 400)
	}

	log.debug(url)

	const link = await Link.addLink(url)

	log.debug(link)

	res.ok(link)
})

router.get('/test', (_req: express.Request, res: express.Response) => {
	res.send('Hello World')
})

export default router