import debounce from 'underscore/modules/debounce'
import Vue from 'vue'

const debounceThreshold = 500

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
		CHANGE_CRATE(state, crate) {
			const idx = state.crates.findIndex((item) => item.key === crate.key)
			if (idx === -1) return

			Vue.set(state.crates, idx, crate)
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
			const link = await this.$api.addLinkToCrate(url, crate)

			commit('ADD_CURRENT_CRATE_LINK', link)

			return link
		},
		async DELETE_LINK({ commit }, linkId) {
			await this.$api.deleteLink(linkId)

			commit('REMOVE_CURRENT_CRATE_LINK', linkId)
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
			return state.crates.find((item) => item.key === state.currentCrate)
		}
	},
	strict: isDev
}