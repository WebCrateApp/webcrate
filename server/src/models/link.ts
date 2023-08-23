
import DetaOrm from 'deta-base-orm'
import { MetaData } from 'metadata-scraper/lib/types'
import { generateId, generateKey } from '../utils/random.js'

const makeAbsoluteUrl = (base: string, path: string) => {
	return new URL(path, base).href
}

export const createLink = (url: string, meta?: MetaData, crate?: string) => {
	const toBeCreated = {
		key: generateKey(true),
		id: generateId(),
		addedAt: new Date().toISOString(),
		url: url,
		crate: crate || 'null',
		meta: {
			title: meta?.title || new URL(url).hostname,
			description: meta?.description,
			image: meta?.image ? makeAbsoluteUrl(url, meta.image) : undefined,
			icon: meta?.icon ? makeAbsoluteUrl(url, meta.icon) : undefined
		},
		public: false,
		addedWith: 'web',
	}

	return Link.save(toBeCreated)
}

export type TLink = {
	id: string
	key: string
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
	addedAt: string
}

const schema = new DetaOrm.Schema<TLink>({
	id: 'string',
	url: {
		type: 'string',
		required: true,
	},
	crate: 'string',
	meta: {
		title: 'string',
		description: 'string',
		image: 'string',
		icon: 'string',
	},
	public: 'boolean',
	addedWith: {
		type: 'string',
		default: 'web',
	},
	addedAt: 'string',
})

export const Link = new DetaOrm.Base('links', schema, { descending: true })