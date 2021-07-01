import getMetaData from 'metadata-scraper'

import db from '../service/db'

export interface Link {
	key: string
	url: string,
	meta?: {
		title?: string,
		description?: string,
		image?: string
	},
	redirect: {
		enabled: boolean,
		shortCode?: string
	},
	addedWith: string,
	addedAt: Date
}

const Links = db.Base('links')

export const addLink = async (url: string) => {
	const meta = await getMetaData(url)

	const data = {
		url,
		meta: {
			title: meta.title,
			description: meta.description,
			image: meta.image
		},
		redirect: {
			enabled: false
		},
		addedWith: 'web',
		addedAt: new Date()
	}

	const res = await Links.insert(data)

	return res as Link
}

export const getLink = async (id: string) => {
	const link = await Links.get(id)

	return link as Link
}

export const getLinkFromShortCode = async (code: string) => {
	const { value } = await Links.fetch({ 'redirect.shortCode': code }).next()

	return value[0] as Link
}

export const getAllLinks = async () => {
	const { value: links } = await Links.fetch().next()

	return links as Array<Link>
}

export const updateLink = async (id: string, changes: any) => {
	await Links.update(changes, id)
}

export const deleteLink = async (id: string) => {
	await Links.delete(id)
}