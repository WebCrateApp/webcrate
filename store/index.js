const isDev = process.env.NODE_ENV !== 'production'

const defaultState = () => {
	return {
		username: 'Maxi',
		loadingCrates: false,
		currentCrate: undefined,
		showSearchModal: false,
		showAddLinkModal: false,
		confirmActionModal: {
			show: false,
			actionText: undefined,
			confirmText: undefined
		},
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
		SET_SHOW_CONFIRM_ACTION_MODAL(state, value) {
			state.confirmActionModal = value
		},
		SET_LOADING_CRATES(state, value) {
			state.loadingCrates = value
		},
		REMOVE_CURRENT_CRATE_LINK(state, value) {
			state.currentCrateLinks = state.currentCrateLinks.filter((item) => item.key !== value)
		}
	},
	actions: {
		SHOW_CONFIRM_ACTION({ commit }, { confirmText, actionText }) {
			commit('SET_SHOW_CONFIRM_ACTION_MODAL', {
				show: true,
				confirmText,
				actionText
			})
		},
		HIDE_CONFIRM_ACTION({ commit }) {
			commit('SET_SHOW_CONFIRM_ACTION_MODAL', {
				show: false,
				confirmText: undefined,
				actionText: undefined
			})
		},
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
		async DELETE_LINK({ commit }, linkId) {
			try {
				await this.$axios.delete(`/api/link?id=${ linkId }`)

				commit('REMOVE_CURRENT_CRATE_LINK', linkId)
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				const data = err.response.data
				throw new Error(data.message || err.message)
			}
		},
		async MOVE_LINK({ commit }, { linkId, crate }) {
			try {
				const { data: res } = await this.$axios.put(`/api/link?id=${ linkId }`, {
					crate
				})

				const data = res.data

				// const { data } = await raw.json()
				if (!data) {
					throw new Error('invalid response')
				}

				commit('REMOVE_CURRENT_CRATE_LINK', linkId)
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				const data = err.response.data
				throw new Error(data.message || err.message)
			}
		},
		async GET_LINKS_FOR_CRATE({ commit }, crate) {
			try {
				const { data: res } = await this.$axios.get(`/api/crate/${ crate }/links`)

				const links = res.data

				// const { data } = await raw.json()
				if (!links) {
					throw new Error('invalid response')
				}

				commit('SET_CURRENT_CRATE_LINKS', links)

				return links
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				console.log(err)
				throw new Error('invalid response')
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