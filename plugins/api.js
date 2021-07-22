
class API {
	constructor(axios, publicMode) {
		this.http = axios.create({
			baseURL: publicMode ? '/api/public' : '/api'
		})

		this.publicMode = publicMode
	}

	async getCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate`)

		return res.data
	}

	async getExternalCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate/external`)

		return res.data
	}

	async getRecentCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate/recent`)

		return res.data
	}

	async getLinksOfCrate(crate) {
		const { data: res } = await this.http.get(`/crate/${ crate }/links`)

		return res.data
	}

	async getLinksOfExternalCrate(crate) {
		const { data: res } = await this.http.get(`/crate/external/${ crate }/links`)

		return res.data
	}

	async getRecentLinks(num = 10) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/link/recent?num=${ num }`)

		return res.data
	}

	async addLinkToCrate(url, crate) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/link`, {
			url,
			crate
		})

		return res.data
	}

	async deleteLink(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/link?id=${ id }`)
	}

	async getLink(id) {
		const { data: res } = await this.http.get(`/link/${ id }`)

		return res.data
	}

	async changeLink(link, data) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/link?id=${ link }`, {
			...data
		})

		return res.data
	}

	async deleteCrate(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/crate?id=${ id }`)
	}

	async deleteExternalCrate(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/crate/external?id=${ id }`)
	}

	async moveLinkToCrate(id, crate) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/link?id=${ id }`, {
			crate
		})

		return res.data
	}

	async addCrate(name, icon) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/crate`, {
			name,
			icon
		})

		return res.data
	}

	async addExternalCrate(url) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/crate/external`, {
			url
		})

		return res.data
	}

	async getCrate(id) {
		const { data: res } = await this.http.get(`/crate/${ id }`)

		return res.data
	}

	async getExternalCrate(id) {
		const { data: res } = await this.http.get(`/crate/external/${ id }`)

		return res.data
	}

	async changeCrate(crate, data) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/crate?id=${ crate }`, {
			...data
		})

		return res.data
	}

	async search(query) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/search?query=${ query }`)

		return res.data
	}
}

export default ({ app: { $axios }, store, params }, inject) => {
	const isPublic = params.pathMatch && params.pathMatch.includes('public')

	if (isPublic) {
		store.commit('SET_PUBLIC_MODE', true)
	}

	const api = new API($axios, isPublic)

	inject('api', api)
}