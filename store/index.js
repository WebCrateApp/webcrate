const isDev = process.env.NODE_ENV !== 'production'

const defaultState = () => {
	return {
		username: 'Maxi',
		loadingCrates: false,
		currentCrate: undefined,
		showSearchModal: false,
		showAddLinkModal: false,
		crates: [],
		currentCrateLinks: []
	}
}

export default {
	state: defaultState,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, defaultState())
		},
		STORE_CRATES(state, data) {
			state.crates = data
		},
		SET_CURRENT_CRATE(state, value) {
			state.currentCrate = value
		},
		SET_CURRENT_CRATE_LINKS(state, value) {
			state.currentCrateLinks = value
		},
		ADD_CURRENT_CRATE_LINK(state, value) {
			state.currentCrateLinks.push(value)
		},
		SET_SHOW_SEARCH_MODAL(state, value) {
			state.showSearchModal = value
		},
		SET_SHOW_ADD_LINK_MODAL(state, value) {
			state.showAddLinkModal = value
		},
		SET_LOADING_CRATES(state, value) {
			state.loadingCrates = value
		}
	},
	actions: {
		async ADD_LINK({ commit }, { url, crate }) {
			try {
				const { data: res } = await this.$axios.post(`/api/link`, {
					url,
					...(![ 'home', 'today' ].includes(crate) && { crate })
				})

				const data = res.data

				// const { data } = await raw.json()
				if (!data) {
					throw new Error('invalid response')
				}

				commit('ADD_CURRENT_CRATE_LINK', data)

				return data
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				const data = err.response.data
				throw new Error(data.message || err.message)
			}
		},
		async GET_CRATES({ commit }) {
			try {
				const { data: res } = await this.$axios.get(`/api/crate`)

				const data = res.data

				// const { data } = await raw.json()
				if (!data) {
					throw new Error('invalid response')
				}

				commit('STORE_CRATES', data)
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				console.log(err)
				throw new Error('invalid response')
			}
		}
	},
	strict: isDev
}