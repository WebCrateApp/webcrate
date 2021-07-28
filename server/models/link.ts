import { MetaData } from 'metadata-scraper/lib/types'
import Base from '../service/base'

const Links = Base.use('links', true)

export class Link {

	id: string
	url: string
	crate?: string
	meta?: {
		title?: string,
		description?: string,
		image?: string,
		icon?: string
	}

	redirect: {
		enabled: boolean,
		shortCode?: string
	}

	addedWith: string
	addedAt: Date

	constructor(data: Link) {
		this.id = data.id
		this.url = data.url
		this.crate = data.crate
		this.meta = data.meta
		this.redirect = data.redirect
		this.addedWith = data.addedWith
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		console.log(changes)
		await Links.findByIdAndUpdate(this.id, changes)
	}

	async delete() {
		await Links.findByIdAndDelete(this.id)
	}

	static async create(url: string, meta?: MetaData, crate?: string): Promise<Link> {

		const makeAbsoluteUrl = (base: string, path: string) => {
			return new URL(path, base).href
		}

		const toBeCreated = {
			url: url,
			crate: crate || 'null',
			meta: {
				...(meta && {
					title: meta.title,
					description: meta.description,
					image: meta.image ? makeAbsoluteUrl(url, meta.image) : undefined,
					icon: meta.icon ? makeAbsoluteUrl(url, meta.icon) : undefined
				})
			},
			redirect: {
				enabled: true
			},
			addedWith: 'web'
		}

		const newLink = await Links.create(toBeCreated)
		return new Link(newLink)
	}

	static async find(query: any = {}, limit?: number, last?: string): Promise<Array<Link>> {
		const links = await Links.find(query, limit, last)

		if (!links) return []

		return links.map((link: Link) => new Link(link))
	}

	static async findOne(query: any) {
		const link = await Links.findOne(query)

		if (!link) return null

		return new Link(link)
	}

	static async findById(id: string) {
		const link = await Links.findById(id)

		if (!link) return null

		return new Link(link)
	}

	static async findByCrate(crate: string): Promise<Array<Link>> {
		const links = await Links.find({ crate })

		if (!links) return []

		return links.map((link: Link) => new Link(link))
	}

	static async findByShortCode(code: string): Promise<Link | null> {
		const link = await Links.findOne({ 'redirect.shortCode': code })

		if (!link) return null

		return new Link(link)
	}

	static async findByIds(ids: Array<string>) {
		const links = await Promise.all(ids.map(async (id) => {
			const data = await Links.findById(id)
			if (!data) return undefined

			return new Link(data)
		}))

		return links.filter((item) => item)
	}
}