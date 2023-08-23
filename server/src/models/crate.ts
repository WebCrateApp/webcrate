
import DetaOrm from 'deta-base-orm'
import type { BaseDocument } from 'deta-base-orm/lib/types.js'
import { generateId, generateKey } from '../utils/random.js'
import emojis from '../utils/emojis.js'

export const createCrate = (name: string, description?: string, icon?: string, isPublic?: boolean) => {
	const randomEmoji = Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]
	const toBeCreated = {
		key: generateKey(false),
		id: generateId(),
		addedAt: new Date().toISOString(),
		name: name,
		icon: icon || randomEmoji,
		description: description || '',
		public: isPublic || false,
		showImages: false
	}

	return Crate.save(toBeCreated)
}

export const findByIds = async (ids: Array<string>) => {
	const crates = await Promise.all(ids.map(async (id) => {
		return Crate.findOne({ id })
	}))

	return crates.filter((item) => item !== undefined) as Array<BaseDocument<TCrate>>
}

export type TCrate = {
	id: string
	key: string
	name: string
	description: string
	icon: string
    public: boolean
	numLinks?: number
	showImages: boolean
	addedAt: string
}

const schema = new DetaOrm.Schema<TCrate>({
	id: 'string',
	key: 'string',
	name: {
		type: 'string',
		required: true,
	},
	description: {
		type: 'string',
		default: '',
	},
	icon: {
		type: 'string',
		required: true,
	},
    public: {
		type: 'boolean',
		default: false,
	},
	numLinks: 'string',
	showImages: {
		type: 'boolean',
		default: false,
	},
	addedAt: 'string',
})

export const Crate = new DetaOrm.Base('crates', schema)