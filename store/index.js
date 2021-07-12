import debounce from 'underscore/modules/debounce'
import Vue from 'vue'

const debounceThreshold = 500

const isDev = process.env.NODE_ENV !== 'production'

const defaultState = () => {
	return {
		username: 'Maxi',
		loadingCrates: false,
		currentCrate: undefined,
		modals: {
			search: false,
			addLink: false,
			addCrate: false,
			inputValue: undefined
		},
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
		CHANGE_CRATE(state, crate) {
			const idx = state.crates.findIndex((item) => item.id === crate.id)
			if (idx === -1) return

			Vue.set(state.crates, idx, crate)
		},
		ADD_CRATE(state, crate) {
			state.crates.push(crate)
		},
		REMOVE_CRATE(state, value) {
			state.crates = state.crates.filter((item) => item.id !== value)
		},
		SET_CURRENT_CRATE_LINKS(state, value) {
			state.currentCrateLinks = value
		},
		ADD_CURRENT_CRATE_LINK(state, value) {
			state.currentCrateLinks.push(value)
		},
		SET_SHOW_MODAL(state, { modal, show }) {
			state.modals[modal] = show
		},
		SET_MODAL_INPUT_VALUE(state, value) {
			state.modals.inputValue = value
		},
		SET_SHOW_CONFIRM_ACTION_MODAL(state, value) {
			state.confirmActionModal = value
		},
		SET_LOADING_CRATES(state, value) {
			state.loadingCrates = value
		},
		REMOVE_CURRENT_CRATE_LINK(state, value) {
			state.currentCrateLinks = state.currentCrateLinks.filter((item) => item.id !== value)
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
		SHOW_MODAL({ commit }, { modal, show, value }) {
			if (value) {
				commit('SET_MODAL_INPUT_VALUE', value)
			}

			commit('SET_SHOW_MODAL', { modal, show })
		},
		async ADD_LINK({ commit }, { url, crate }) {
			const link = await this.$api.addLinkToCrate(url, crate)

			commit('ADD_CURRENT_CRATE_LINK', link)

			return link
		},
		async DELETE_LINK({ commit }, linkId) {
			await this.$api.deleteLink(linkId)

			commit('REMOVE_CURRENT_CRATE_LINK', linkId)
		},
		async DELETE_CRATE({ commit }, crateId) {
			await this.$api.deleteCrate(crateId)

			commit('REMOVE_CRATE', crateId)
		},
		async MOVE_LINK({ commit }, { linkId, crate }) {
			await this.$api.moveLinkToCrate(linkId, crate)

			commit('REMOVE_CURRENT_CRATE_LINK', linkId)
		},
		async GET_LINKS_FOR_CRATE({ commit }, crate) {
			const links = await this.$api.getLinksOfCrate(crate)

			commit('SET_CURRENT_CRATE_LINKS', links)

			return links
		},
		async ADD_CRATE({ commit }, { name }) {
			const crate = await this.$api.addCrate(name)

			commit('ADD_CRATE', crate)

			return crate
		},
		async GET_CRATES({ commit }) {
			const crates = await this.$api.getCrates()

			commit('STORE_CRATES', crates)
		},
		CHANGE_CRATE_DESCRIPTION: debounce(async function(context, { crateId, description }) {
			const crate = await this.$api.changeCrate(crateId, { description })

			context.commit('CHANGE_CRATE', crate)
		}, debounceThreshold),
		CHANGE_CRATE_NAME: debounce(async function(context, { crateId, name }) {
			const crate = await this.$api.changeCrate(crateId, { name })

			context.commit('CHANGE_CRATE', crate)
		}, debounceThreshold)
	},
	getters: {
		currentCrate: (state) => {
			return state.crates.find((item) => item.id === state.currentCrate)
		}
	},
	strict: isDev
}