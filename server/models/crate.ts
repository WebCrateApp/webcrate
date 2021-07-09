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
	addedAt: Date

	constructor(data: any) {
		this.id = data.id
		this.name = data.name
		this.description = data.description
		this.icon = data.icon
		this.public = data.public
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
			public: isPublic || false
		}

		const newCrate = await Crates.create(toBeCreated)
		return new Crate(newCrate)
	}

	// TODO: Track when a crate was last viewed and sort after that
	static async getRecentlyUsed(): Promise<Array<Crate>> {
		const crates = await Crates.find({}, 5)

		if (!crates) return []

		return crates.map((crate: Crate) => new Crate(crate))
	}

	static async find(query: any = {}, limit?: number, last?: string): Promise<Array<Crate>> {
		const crates = await Crates.find(query, limit, last)

		if (!crates) return []

		return crates.map((crate: Crate) => new Crate(crate))
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
}