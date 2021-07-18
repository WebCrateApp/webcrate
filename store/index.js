import debounce from 'underscore/modules/debounce'
import Vue from 'vue'

const debounceThreshold = 500

const defaultState = () => {
	return {
		username: 'Maxi',
		loadingCrates: false,
		currentCrate: undefined,
		crates: [],
		currentCrateLinks: [],
		currentLink: undefined
	}
}

export const state = defaultState

export const mutations = {
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
	SET_CURRENT_LINK(state, value) {
		state.currentLink = value
	},
	CHANGE_LINK(state, link) {
		const idx = state.currentCrateLinks.findIndex((item) => item.id === link.id)
		if (idx === -1) return

		Vue.set(state.currentCrateLinks, idx, link)
	},
	SET_LOADING_CRATES(state, value) {
		state.loadingCrates = value
	},
	REMOVE_CURRENT_CRATE_LINK(state, value) {
		state.currentCrateLinks = state.currentCrateLinks.filter((item) => item.id !== value)
	}
}

export const actions = {
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
	async ADD_CRATE({ commit }, { name, icon }) {
		const crate = await this.$api.addCrate(name, icon)

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
	}, debounceThreshold),
	async CHANGE_CRATE_ICON(context, { crateId, icon }) {
		const crate = await this.$api.changeCrate(crateId, { icon })

		context.commit('CHANGE_CRATE', crate)
	},
	async CHANGE_LINK(context, { linkId, changes }) {
		const link = await this.$api.changeLink(linkId, changes)

		context.commit('CHANGE_LINK', link)
	}
}

export const getters = {
	currentCrate: (state) => {
		return state.crates.find((item) => item.id === state.currentCrate)
	}
}