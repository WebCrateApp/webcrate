import express from 'express'

import apiRouter from './api'
import redirectRouter from './redirect'
import wildcardAddRouter from './wildcardAdd'

export const router = express.Router()

router.use('/api', apiRouter)
router.use('/r', redirectRouter)
router.use('/n', wildcardAddRouter)

router.get('/test', (_req: express.Request, res: express.Response) => {
	res.send('Hello World')
})

export default router