/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable no-undef */

/* const schema = BaseOrm.schema({
	name: String,
	age: Number,
	info: {
		married: Boolean
	},
	likes: Array
})

const migrations = BaseOrm.migrations({
	'v0.1.0': (model) => {
		model.update('key', 'value')
	},
	'v1.0.0': (model) => {
		model.update('key', 'value')
	}
})

const Model = BaseOrm.model('name', schema, migrations)

Model.find()
Model.findOne()
Model.findById()
Model.findOneAndUpdate()
Model.findByIdAndUpdate()

Model.findOne() // => Document
Model.create('data') // => Document
new Model('data') // => Document

Document.update()
Document.delete()

Document.name // => 'name' */

import { Deta } from 'deta'
import Base from 'deta/dist/types/base'
import { generateId, generateKey } from '../../utils/random'

class Model {
	data: any
	static _baseName: string
	static _baseSchema: any
	static _db: Base

	constructor(data: any) {
		this.data = data
	}

	save() {
		return new Document(this.data)
	}

	static async _fetch(query: any = {}, limit?: number, last?: string) {
		let res = await this._db.fetch(query, limit ? { limit, last } : undefined)
		let items: Array<any> = res.items

		// We already have enough data
		if (limit && items.length === limit) return items

		// More data available
		while (res.last) {
			res = await this._db.fetch(query, {
				// If we have a limit set we only need to get the remaining items
				...(limit) && { limit: limit - items.length },

				// Since the last item
				last: res.last
			})

			items = items.concat(items)
		}

		// We have everything
		return items
	}

	static async find(query: any = {}, limit?: number, last?: string) {
		const items = await this._fetch(query, limit, last)
		const res = items.map((item: any) => {
			return new Document(item)
		})

		return res
	}

	static async findOne(query: any) {
		const res = await this._db.fetch(query, { limit: 1 })

		if (res.count < 1) return null

		return new Document(res.items[0])
	}

	static async findById(id: string) {
		const res = await this._db.fetch({ id }, { limit: 1 })

		if (res.count < 1) return null

		return new Document(res.items[0])
	}

	static async findOneAndUpdate(query: any, data: any) {
		const item = await this.findOne(query)
		if (!item) throw new Error('No item with that id exists')

		// Prevent accidently changing immutable attributes
		const newItem = {
			...data,
			key: undefined
		}

		await this._db.update(newItem, item.key)
	}

	static async findByIdAndUpdate(id: string, data: any) {
		const item = await this.findById(id)
		if (!item) throw new Error('No item with that id exists')

		// Prevent accidently changing immutable attributes
		const newItem = {
			...data,
			key: undefined
		}

		await this._db.update(newItem, item.key)
	}

	static async findByIdAndDelete(id: string) {
		const item = await this.findById(id)
		if (!item) throw new Error('No item with that id exists')

		await this._db.delete(item.key)
	}

	static async findOneAndDelete(query: any) {
		const item = await this.findOne(query)
		if (!item) throw new Error('No item with that id exists')

		await this._db.delete(item.key)
	}

	static async create(data: any) {
		// Generate defaults but allow changing them through data object
		const toBeCreated = {
			key: generateKey(),
			id: generateId(),
			addedAt: new Date(),
			...data
		}

		// Use put and not insert as we can assume our random key doesn't exist
		const newItem = await this._db.put(toBeCreated)

		return new Document(newItem)
	}
}

class Document {
	data: any
	key: string

	constructor(data: any) {
		this.data = data
		this.key = data.key
	}

	update(changes: any) {
		return changes
	}

	delete() {
		return true
	}
}

const createModel = (name: string, schema?: any) => {
	const deta = Deta()
	const db = deta.Base(name)

	Model._baseName = name
	Model._baseSchema = schema
	Model._db = db

	return Model
}

const BaseOrm = {
	model: createModel
}

const run = async () => {
	const CrateModel = BaseOrm.model('crate')

	const crate = await CrateModel.findOne('test')

	console.log(crate)

	crate?.delete()

	const crate2 = await CrateModel.create('test')
	console.log(crate2)
	crate2?.delete()

	const crate3 = new CrateModel('test')
	crate3.save()
}

run()