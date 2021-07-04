const isDev = process.env.NODE_ENV !== 'production'

const defaultState = () => {
	return {
		crates: []
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
		}
	},
	actions: {
		async ADD_SERVER({ commit }, server) {
			try {
				const raw = await this.$http.get(`${ server.endpoint }/server`, {
					headers: {
						Authorization: `Bearer ${ server.accessKey }`
					}
				})

				const { data } = await raw.json()
				if (!data) {
					throw new Error('invalid server')
				}

				const newServer = {
					...data,
					...server
				}

				commit('ADD_SERVER', newServer)
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				console.log(err)
				throw new Error('invalid server')
			}
		},
		async GET_CRATES({ commit }) {
			try {
				const raw = await this.$axios.get(`/api/crate`)

				const { data } = await raw.json()
				if (!data) {
					throw new Error('invalid response')
				}

				commit('STORE_CRATES', data)
			} catch (err) {
				if (err.name === 'HTTPERROR') {
					throw new Error(err)
				}

				console.log(err)
				throw new Error('invalid server')
			}
		}
	},
	strict: isDev
}