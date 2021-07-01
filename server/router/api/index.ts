import express from 'express'

import linkRouter from './link'

export const router = express.Router()

router.use('/link', linkRouter)

export default router