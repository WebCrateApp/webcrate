import got from 'got'

import DetaOrm from 'deta-base-orm'
import type { BaseDocument } from 'deta-base-orm/lib/types.js'
import { generateId, generateKey } from '../utils/random.js'

export const refresh = async (externalCrate: BaseDocument<TExternalCrate>) => {
	const { data } = await got.get(`https://${ externalCrate.endpoint }/api/public/crate/${ externalCrate.id }`).json() as any

	await externalCrate.update({ name: data.name, description: data.description, icon: data.icon })
}

export const createExternalCrate = (endpoint: string, id: string) => {
	const toBeCreated = {
		key: generateKey(false),
		id: id || generateId(),
		addedAt: new Date().toISOString(),
		endpoint
	}

	return ExternalCrate.save(toBeCreated)
}

export type TExternalCrate = {
	id: string
	key: string
	name?: string
	description?: string
	icon?: string
	deleted?: boolean
	endpoint: string
	addedAt: string
}

const schema = new DetaOrm.Schema<TExternalCrate>({
	id: 'string',
	key: 'string',
	name: {
		type: 'string',
		default: '',
	},
	description: {
		type: 'string',
		default: '',
	},
	icon: {
		type: 'string',
		default: ''
	},
    deleted: {
		type: 'boolean',
		default: false,
	},
	endpoint: 'string',
	addedAt: 'string',
})

export const ExternalCrate = new DetaOrm.Base('externalCrates', schema)