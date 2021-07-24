import express from 'express'

import linkRouter from './link'
import crateRouter from './crate'
import searchRouter from './search'
import configRouter from './config'
import publicRouter from './public'

export const router = express.Router()

router.use('/link', linkRouter)
router.use('/crate', crateRouter)
router.use('/search', searchRouter)
router.use('/config', configRouter)
router.use('/public', publicRouter)

export default router