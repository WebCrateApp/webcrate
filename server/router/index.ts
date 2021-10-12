import express from 'express'

import apiRouter from './api'
import imageRouter from './image'
import wildcardRouter from './wildcard'

export const router = express.Router()

router.use('/api', apiRouter)
router.use('/img', imageRouter)
router.use(wildcardRouter)

export default router