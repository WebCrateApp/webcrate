import express from 'express'

import linkRouter from './link'
import crateRouter from './crate'
import searchRouter from './search'

export const router = express.Router()

router.use('/link', linkRouter)
router.use('/crate', crateRouter)
router.use('/search', searchRouter)

export default router