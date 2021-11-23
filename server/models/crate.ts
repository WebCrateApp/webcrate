import Base from '../service/base'
import emojis from '../utils/emojis'

const Crates = Base.use('crates')

export class Crate {

	id: string
	name: string
	description: string
	icon: string
    public: boolean
	numLinks?: number
	showImages: boolean
	addedAt: Date

	constructor(data: any) {
		this.id = data.id
		this.name = data.name
		this.description = data.description
		this.icon = data.icon
		this.public = data.public
		this.showImages = data.showImages || false
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		await Crates.findByIdAndUpdate(this.id, changes)
	}

	async delete() {
		await Crates.findByIdAndDelete(this.id)
	}

	static async create(name: string, description?: string, icon?: string, isPublic?: boolean): Promise<Crate> {
		const randomEmoji = Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]
		const toBeCreated = {
			name: name,
			icon: icon || randomEmoji,
			description: description || undefined,
			public: isPublic || false,
			showImages: false
		}

		const newCrate = await Crates.create(toBeCreated)
		return new Crate(newCrate)
	}

	static async find(query: any = {}, limit?: number, lastId?: string) {
		const { items, count, last } = await Crates.find(query, limit, lastId)

		if (!items) return { items: [], count: 0, last: undefined }

		return { count, last, items: items.map((crate: Crate) => new Crate(crate)) }
	}

	static async findOne(query: any) {
		const crate = await Crates.findOne(query)

		if (!crate) return null

		return new Crate(crate)
	}

	static async findById(id: string) {
		const crate = await Crates.findById(id)

		if (!crate) return null

		return new Crate(crate)
	}

	static async findByIds(ids: Array<string>) {
		const crates = await Promise.all(ids.map(async (id) => {
			const data = await Crates.findById(id)
			if (!data) return undefined

			return new Crate(data)
		}))

		return crates.filter((item) => item !== undefined) as Array<Crate>
	}
}