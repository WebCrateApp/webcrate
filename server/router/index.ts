import express from 'express'

import apiRouter from './api/index.js'
import imageRouter from './image.js'
import wildcardRouter from './wildcard.js'

export const router = express.Router()

router.use('/api', apiRouter)
router.use('/img', imageRouter)
router.use(wildcardRouter)

export default router