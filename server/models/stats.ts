import Base from '../service/base'

const Stats = Base.use('stats')

const RECENTLY_USED_CRATES_ID = 'recently_used_crates'
const MAX_RECENT_CRATES = 5

const RECENTLY_USED_LINKS_ID = 'recently_used_links'
const MAX_RECENT_LINKS = 10

export class Stat {

	id: string
	data: any

	constructor(data: any) {
		this.id = data.id
		this.data = data.data
	}

	async update(changes: any) {
		await Stats.findByIdAndUpdate(this.id, changes)
	}

	async delete() {
		await Stats.findByIdAndDelete(this.id)
	}

	static async create(id: string, data: any): Promise<Stat> {
		const toBeCreated = {
			id,
			data
		}

		const newCrate = await Stats.create(toBeCreated)
		return new Stat(newCrate)
	}

	static async addRecentlyUsedCrate(crateId: string) {
		const id = RECENTLY_USED_CRATES_ID
		const exists = await this.findById(id)
		if (!exists) {
			await this.create(id, [ crateId ])
			return
		}

		let data: Array<string> = exists.data

		// Remove existing crateId
		data = data.filter((item) => item !== crateId)

		// Add crateId to the front
		data.unshift(crateId)

		// If more than MAX_RECENT_CRATES recent items, remove last one
		if (data.length > MAX_RECENT_CRATES) data.pop()

		// Finally update the stat with the new items
		await exists.update({ data })
	}

	static async getRecentlyUsedCrateIds() {
		const id = RECENTLY_USED_CRATES_ID
		const res = await this.findById(id)
		return res?.data
	}

	static async addRecentlyAddedLink(linkId: string) {
		const id = RECENTLY_USED_LINKS_ID
		const exists = await this.findById(id)
		if (!exists) {
			await this.create(id, [ linkId ])
			return
		}

		let data: Array<string> = exists.data

		// Remove existing linkId
		data = data.filter((item) => item !== linkId)

		// Add linkId to the front
		data.unshift(linkId)

		// If more than MAX_RECENT_LINKS recent items, remove last one
		if (data.length > MAX_RECENT_LINKS) data.pop()

		// Finally update the stat with the new items
		await exists.update({ data })
	}

	static async getRecentlyAddedLinkIds() {
		const id = RECENTLY_USED_LINKS_ID
		const res = await this.findById(id)
		return res?.data
	}

	static async findById(id: string) {
		const crate = await Stats.findById(id)

		if (!crate) return null

		return new Stat(crate)
	}
}