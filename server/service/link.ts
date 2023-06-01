import getMetaData from 'metadata-scraper'
import { MetaData } from 'metadata-scraper/lib/types'

import { Link } from '../models/link.js'
import { Stat } from '../models/stats.js'

import log from '../utils/log.js'
import { parseUrl } from '../utils/url.js'

export const createLink = async (url: string, crate?: string, title?: string) => {
	const parsedUrl = parseUrl(url)

	let meta: MetaData | undefined
	try {
		// Workaround to Twitter to include the right meta tags
		const useGoogleUa = parsedUrl.includes('twitter.com')

		meta = await getMetaData(parsedUrl, {
			...(useGoogleUa && { ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' })
		})

		// Add title to meta object
		if (title) meta.title = title
	} catch (err) {
		log.debug(err)
	}

	const link = await Link.create(parsedUrl, meta, crate)

	await Stat.addRecentlyAddedLink(link.id)

	if (crate) {
		await Stat.addRecentlyUsedCrate(crate)
	}

	return link
}