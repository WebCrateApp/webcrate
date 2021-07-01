import getMetaData from 'metadata-scraper'

import db from '../service/db'

const Links = db.Base('links')

export class Link {

	key: string
	url: string
	crate?: string
	meta?: {
		title?: string,
		description?: string,
		image?: string
	}

	redirect: {
		enabled: boolean,
		shortCode?: string
	}

	addedWith: string
	addedAt: Date

	constructor(data: Link) {
		this.key = data.key
		this.url = data.url
		this.meta = data.meta
		this.redirect = data.redirect
		this.addedWith = data.addedWith
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		await Links.update(changes, this.key)
	}

	async delete() {
		await Links.delete(this.key)
	}

	static async create(url: string, crate?: string): Promise<Link> {
		const meta = await getMetaData(url)

		const toBeCreated = {
			url,
			crate,
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

		const newLink = await Links.insert(toBeCreated)

		return new Link(newLink)
	}

	static async getAll(): Promise<Array<Link>> {
		const { value: links } = await Links.fetch().next()

		if (!links) return []

		return links.map((link: Link) => new Link(link))
	}

	static async getAllByCrate(crate: string): Promise<Array<Link>> {
		const { value: links } = await Links.fetch({ crate }).next()

		if (!links) return []

		return links.map((link: Link) => new Link(link))
	}

	static async getById(id: string): Promise<Link | null> {
		const data: Link = await Links.get(id)

		if (!data) return null

		return new Link(data)
	}

	static async getByShortCode(code: string): Promise<Link | null> {
		const { value } = await Links.fetch({ 'redirect.shortCode': code }).next()

		if (!value) return null

		return new Link(value[0])
	}
}