import { Deta } from 'deta'

/*
    Build object modeling tool similar to mongoose for Deta Base

    - define schema for each Base
    - add mongoose methods for interacting with a Base (find, findOne etc.)
    - reuse Base's query object in find

*/

const isDev = process.env.NODE_ENVIRONMENT !== 'prod'

const deta = Deta(isDev ? process.env.DETA_PROJECT_KEY || '' : '')

const Schema = (obj: any) => {
	return {
		key: {
			type: String,
			required: true
		},
		...obj
	}
}

Schema.prototype.constructor = Schema

const Model = (name: string, schema: typeof Schema) => {

	Document.baseName = name
	Document.schema = schema
	Document.db = deta.Base(name)

	return Document
}

class Document {

	data: any
	// eslint-disable-next-line no-unused-vars
	static schema: (obj: any) => any
	static baseName: string
	static db: any

	constructor(data: any) {
		// TODO verify data based on schema
		this.data = data
	}

	async update(changes: any) {
		await Document.db.update(changes, this.data.key)
	}

	async delete() {
		await Document.db.delete(this.data.key)
	}

	async create(): Promise<Document> {
		const toBeCreated = {
			...this.data,
			addedAt: new Date()
		}

		const newCrate = await Document.db.insert(toBeCreated)

		return newCrate
	}

	static async getAll(): Promise<Array<any>> {
		const { value: crates } = await Document.db.fetch().next()

		if (!crates) return []

		return crates
	}

	static async getById(id: string): Promise<any | null> {
		const data = await Document.db.get(id)

		if (!data) return null

		return data
	}
}

export {
	Schema,
	Model
}