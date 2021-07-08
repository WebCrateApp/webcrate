import db from '../service/db'
import emojis from '../utils/emojis'

const Crates = db.Base('crates')

export class Crate {

	key: string
	name: string
	description: string
	icon: string
    public: boolean
	numLinks?: number
	addedAt: Date

	constructor(data: Crate) {
		this.key = data.key
		this.name = data.name
		this.description = data.description
		this.icon = data.icon
		this.public = data.public
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		await Crates.update(changes, this.key)
	}

	async delete() {
		await Crates.delete(this.key)
	}

	static async create(name: string, description?: string, icon?: string, isPublic?: boolean): Promise<Crate> {
		const randomEmoji = Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]
		const toBeCreated = {
			name,
			icon: icon || randomEmoji,
			description: description || undefined,
			public: isPublic || false,
			addedAt: new Date()
		}

		const newCrate = await Crates.insert(toBeCreated)

		const crate = new Crate(newCrate)

		return crate
	}

	static async getAll(): Promise<Array<Crate>> {
		const { value: crates } = await Crates.fetch().next()

		if (!crates) return []

		return crates.map((crate: Crate) => new Crate(crate))
	}

	// TODO: Track when a crate was last viewed and sort after that
	static async getRecentlyUsed(): Promise<Array<Crate>> {
		const { value: crates } = await Crates.fetch({}, 1, 5).next()

		if (!crates) return []

		return crates.map((crate: Crate) => new Crate(crate))
	}

	static async query(query: any): Promise<Array<Crate>> {
		const { value: crates } = await Crates.fetch(query).next()

		if (!crates) return []

		return crates.map((crate: Crate) => new Crate(crate))
	}

	static async getById(id: string): Promise<Crate | null> {
		const data: Crate = await Crates.get(id)

		if (!data) return null

		return new Crate(data)
	}
}