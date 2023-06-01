import express from 'express'

import linkRouter from './link.js'
import crateRouter from './crate.js'
import searchRouter from './search.js'
import configRouter from './config.js'
import publicRouter from './public.js'

export const router = express.Router()

router.use('/link', linkRouter)
router.use('/crate', crateRouter)
router.use('/search', searchRouter)
router.use('/config', configRouter)
router.use('/public', publicRouter)

export default router