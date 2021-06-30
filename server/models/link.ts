import getMetaData from 'metadata-scraper'

import db from '../service/db'

export interface Link {
	key: string
	url: string,
	meta?: {
		title?: string,
		description?: string,
		image?: string
	}
	public: boolean
	addedWith: string,
	addedAt: Date
}

const Links = db.Base('links')

export const addLink = async (url: string) => {
	const meta = await getMetaData(url)

	console.log(meta)

	const data = {
		url,
		meta: {
			title: meta.title,
			description: meta.description,
			image: meta.image
		},
		public: false,
		addedWith: 'web',
		addedAt: new Date()
	}

	const res = await Links.insert(data)

	return res as Link
}