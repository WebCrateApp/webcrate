import { Link } from '../models/link'

export const getLink = async (path: string) => {
	let link = await Link.findById(path)
	if (!link) {
		link = await Link.findByShortCode(path)

		if (!link) return undefined
	}

	return link
}