import db from '../service/db'

const Crates = db.Base('crates')

export class Crate {

	key: string
	name: string
    public: boolean
	addedAt: Date

	constructor(data: Crate) {
		this.key = data.key
		this.name = data.name
		this.public = data.public
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		await Crates.update(changes, this.key)
	}

	async delete() {
		await Crates.delete(this.key)
	}

	static async create(name: string, isPublic?: boolean): Promise<Crate> {
		const toBeCreated = {
			name,
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

	static async getById(id: string): Promise<Crate | null> {
		const data: Crate = await Crates.get(id)

		if (!data) return null

		return new Crate(data)
	}
}