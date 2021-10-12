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

	public?: boolean

	addedWith: string
	addedAt: Date

	constructor(data: Link) {
		this.id = data.id
		this.url = data.url
		this.crate = data.crate
		this.meta = data.meta
		this.public = data.public
		this.addedWith = data.addedWith
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
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
				title: meta?.title || new URL(url).hostname,
				description: meta?.description,
				image: meta?.image ? makeAbsoluteUrl(url, meta.image) : undefined,
				icon: meta?.icon ? makeAbsoluteUrl(url, meta.icon) : undefined
			},
			public: false,
			addedWith: 'web'
		}

		const newLink = await Links.create(toBeCreated)
		return new Link(newLink)
	}

	static async find(query: any = {}, limit?: number, lastId?: string) {
		const { items, count, last } = await Links.find(query, limit, lastId)

		if (!items) return { count: 0, last: undefined, items: [] }

		return { count, last, items: items.map((link: Link) => new Link(link)) }
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

	static async findByCrate(crate: string, limit?: number, lastId?: string) {
		const { items, count, last } = await Links.find({ crate }, limit, lastId)

		if (!items) return { count: 0, last: undefined, items: [] }

		return { count, last, items: items.map((link: Link) => new Link(link)) }
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