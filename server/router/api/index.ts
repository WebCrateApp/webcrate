import express from 'express'

import linkRouter from './link'
import crateRouter from './crate'

export const router = express.Router()

router.use('/link', linkRouter)
router.use('/crate', crateRouter)

export default router