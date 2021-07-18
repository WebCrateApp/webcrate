import express from 'express'

import { Crate } from '../../models/crate'
import { Link } from '../../models/link'
import log from '../../utils/log'

export const router = express.Router()

const capitalize = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const query = req.query.query as string
		if (!query) {
			return res.fail(400, 'no query provided')
		}

		log.debug(query)

		const crates = await Crate.find([
			{ 'name?contains': query },
			{ 'name?contains': capitalize(query) },
			{ 'description?contains': query },
			{ 'description?contains': capitalize(query) },
			{ 'icon?contains': query }
		], 5)

		log.debug(crates)

		const links = await Link.find([
			{ 'meta.title?contains': query },
			{ 'meta.title?contains': capitalize(query) },
			{ 'meta.description?contains': query },
			{ 'meta.description?contains': capitalize(query) },
			{ 'url?contains': query }
		], 5)

		log.debug(links)

		res.ok({
			crates,
			links
		})
	} catch (err) {
		return next(err)
	}
})

export default router