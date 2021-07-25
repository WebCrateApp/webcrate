import got from 'got'

import Base from '../service/base'

const Crates = Base.use('externalCrates')

export class ExternalCrate {

	id: string
	name?: string
	description?: string
	icon?: string
	endpoint: string
	addedAt: Date

	constructor(data: any) {
		this.id = data.id
		this.name = data.name
		this.description = data.description
		this.icon = data.icon
		this.endpoint = data.endpoint
		this.addedAt = data.addedAt
	}

	async update(changes: any) {
		await Crates.findByIdAndUpdate(this.id, changes)
	}

	async delete() {
		await Crates.findByIdAndDelete(this.id)
	}

	async refresh() {
		const { data } = await got.get(`https://${ this.endpoint }/api/public/crate/${ this.id }`).json()

		this.update({ name: data.name, description: data.description, icon: data.icon })
		this.name = data.name
		this.description = data.description
		this.icon = data.icon
	}

	static async create(endpoint: string, id: string): Promise<ExternalCrate> {
		const toBeCreated = {
			endpoint,
			id
		}

		const newCrate = await Crates.create(toBeCreated)
		return new ExternalCrate(newCrate)
	}

	static async find(query: any = {}, limit?: number, last?: string): Promise<Array<ExternalCrate>> {
		const crates = await Crates.find(query, limit, last)

		if (!crates) return []

		return crates.map((crate: ExternalCrate) => new ExternalCrate(crate))
	}

	static async findOne(query: any) {
		const crate = await Crates.findOne(query)

		if (!crate) return null

		return new ExternalCrate(crate)
	}

	static async findById(id: string) {
		const crate = await Crates.findById(id)

		if (!crate) return null

		return new ExternalCrate(crate)
	}
}