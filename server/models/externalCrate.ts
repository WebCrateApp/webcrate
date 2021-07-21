import got from 'got'

import Base from '../service/base'

const Crates = Base.use('externalCrates')

export class ExternalCrate {

	id: string
	endpoint: string
	addedAt: Date

	constructor(data: any) {
		this.id = data.id
		this.endpoint = data.endpoint
		this.addedAt = data.addedAt
	}

	async delete() {
		await Crates.findByIdAndDelete(this.id)
	}

	async refresh() {
		const { data } = await got.get(`https://${ this.endpoint }/api/public/crate/${ this.id }`).json()

		return {
			...data,
			endpoint: this.endpoint,
			addedAt: this.addedAt
		}
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