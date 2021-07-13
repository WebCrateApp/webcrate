
class API {
	constructor(axios) {
		this.http = axios
	}

	async getCrates() {
		const { data: res } = await this.http.get(`/api/crate`)

		return res.data
	}

	async getRecentCrates() {
		const { data: res } = await this.http.get(`/api/crate/recent`)

		return res.data
	}

	async getLinksOfCrate(crate) {
		const { data: res } = await this.http.get(`/api/crate/${ crate }/links`)

		return res.data
	}

	async getRecentLinks() {
		const { data: res } = await this.http.get(`/api/link/recent`)

		return res.data
	}

	async addLinkToCrate(url, crate) {
		const { data: res } = await this.http.post(`/api/link`, {
			url,
			crate
		})

		return res.data
	}

	async deleteLink(id) {
		await this.http.delete(`/api/link?id=${ id }`)
	}

	async deleteCrate(id) {
		await this.http.delete(`/api/crate?id=${ id }`)
	}

	async moveLinkToCrate(id, crate) {
		const { data: res } = await this.http.put(`/api/link?id=${ id }`, {
			crate
		})

		return res.data
	}

	async addCrate(name, icon) {
		const { data: res } = await this.http.post(`/api/crate`, {
			name,
			icon
		})

		return res.data
	}

	async getCrate(id) {
		const { data: res } = await this.http.get(`/api/crate/${ id }`)

		return res.data
	}

	async changeCrate(crate, data) {
		const { data: res } = await this.http.put(`/api/crate?id=${ crate }`, {
			...data
		})

		return res.data
	}
}

export default ({ app: { $axios } }, inject) => {
	const api = new API($axios)

	inject('api', api)
}