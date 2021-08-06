import { generateId, generateKey } from '../utils/random'
import db from './db'

export default class Base {

	db: any
	descendingOrder: boolean

	constructor(name: string, descendingOrder: boolean) {
		this.db = db.Base(name)
		this.descendingOrder = descendingOrder
	}

	async create(data: any) {
		// Generate defaults but allow changing them through data object
		const toBeCreated = {
			key: generateKey(this.descendingOrder),
			id: generateId(),
			addedAt: new Date(),
			...data
		}

		// Use put and not insert as we can assume our random key doesn't exist
		const newItem = await this.db.put(toBeCreated)

		return newItem
	}

	async findByIdAndUpdate(id: string, data: any) {
		const item = await this.findById(id)
		if (!item) throw new Error('No item with that id exists')

		// Prevent accidently changing immutable attributes
		const newItem = {
			...data,
			key: undefined,
			id: undefined,
			addedAt: undefined
		}

		await this.db.update(newItem, item.key)
	}

	async findByIdAndDelete(id: string) {
		const item = await this.findById(id)
		if (!item) throw new Error('No item with that id exists')

		await this.db.delete(item.key)
	}

	async find(query: any = {}, limit?: number, lastId?: string) {

		const last = lastId ? (await this.findById(lastId)).key : undefined

		let res = await this.db.fetch(query, limit ? { limit, last } : undefined)
		let items: Array<any> = res.items

		// We already have enough data
		if (limit && items.length === limit) return { count: items.length, last: items[items.length - 1]?.id, items }

		// More data available
		while (res.last) {
			res = await this.db.fetch(query, {
				// If we have a limit set we only need to get the remaining items
				...(limit) && { limit: limit - items.length },

				// Since the last item
				last: res.last
			})

			items = items.concat(items)
		}

		// We have everything
		return { count: items.length, last: undefined, items }
	}

	async findOne(query: any) {
		const res = await this.db.fetch(query, { limit: 1 })

		if (res.count < 1) return null

		return res.items[0]
	}

	async findById(id: string) {
		const res = await this.db.fetch({ id }, { limit: 1 })

		if (res.count < 1) return null

		return res.items[0]
	}

	static use(name: string, descendingOrder = false): Base {
		return new Base(name, descendingOrder)
	}
}