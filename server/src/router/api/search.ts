import express from 'express'

import { Crate } from '../../models/crate.js'
import { Link } from '../../models/link.js'
import log from '../../utils/log.js'
import { parsePaginate } from '../../middleware/index.js'

export const router = express.Router()

const capitalize = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

router.get('/', parsePaginate, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const limit = req?.paginate?.limit
		const last = req?.paginate?.last
		const query = req.query.query as string

		if (!query) {
			return res.fail(400, 'no query provided')
		}

		log.debug(query)

		const crates = await Crate.find([
			{ name: { $con: query }},
			{ name: { $con: capitalize(query) }},
			{ description: { $con: query }},
			{ description: { $con: capitalize(query) }},
			{ icon: { $con: query }},
		], 5)

		log.debug(crates)

		// todo: fix using filters in nested queries
		const links = await Link.find([
			{ 'meta.title?contains': query },
			{ 'meta.title?contains': capitalize(query) },
			{ 'meta.description?contains': query },
			{ 'meta.description?contains': capitalize(query) },
			{ 'url?contains': query }
		] as any, limit, last)

		log.debug(links)

		// res.ok({
		// 	last: links.last,
		// 	crates: crates.items,
		// 	links: links.items
		// })

		// todo: use pagination
		res.ok({
			last: '',
			crates: crates,
			links: links
		})
	} catch (err) {
		return next(err)
	}
})

export default router