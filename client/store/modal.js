const modals = [ 'search', 'addLink', 'addCrate', 'addExternalCrate', 'linkDetails', 'confirm', 'copyOutput', 'changeName', 'shareLink', 'bookmarklet', 'changelog', 'viewImage', 'changeCrate' ]

export const state = () => ({
	show: undefined,
	data: {
		title: undefined,
		message: undefined,
		editable: undefined,
		endpoint: undefined,
		inputValue: undefined,
		actionText: undefined,
		confirmText: undefined,
		link: undefined
	}
})

export const mutations = {
	replace(state, { modal, data }) {
		if (!modals.includes(modal)) throw new Error(`Unknown modal: ${ modal }`)

		state.show = {
			[modal]: true
		}

		state.data = { ...state.data, ...data }
	},
	show(state, { modal, data }) {
		if (!modals.includes(modal)) throw new Error(`Unknown modal: ${ modal }`)

		state.show = {
			...state.show,
			[modal]: true
		}

		state.data = { ...state.data, ...data }
	},
	hide(state, modal) {
		if (modal) {
			state.show = {
				...state.show,
				[modal]: false
			}

			return
		}

		state.show = undefined
	},
	set_data(state, data) {
		state.data = { ...state.data, ...data }
	}
}

export const actions = {
	SHOW_CONFIRM({ commit }, { confirmText, actionText }) {
		commit('SHOW_MODAL', {
			modale: 'confirm',
			data: {
				confirmText,
				actionText
			}
		})
	},
	HIDE_CONFIRM({ commit }) {
		commit('HIDE_MODAL', 'confirm')
	}
}