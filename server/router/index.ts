import express from 'express'

import apiRouter from './api'
import redirectRouter from './redirect'
import wildcardAddRouter from './wildcardAdd'

export const router = express.Router()

router.use('/api', apiRouter)
router.use('/r', redirectRouter)
router.use(wildcardAddRouter)

export default router