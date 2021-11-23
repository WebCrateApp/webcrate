import debounce from 'underscore/modules/debounce'
import Vue from 'vue'

const debounceThreshold = 500

const defaultState = () => {
	return {
		config: {
			name: undefined
		},
		publicMode: false,
		loadingCrates: false,
		currentCrate: undefined,
		crates: [],
		externalCrates: [],
		currentCrateLinks: [],
		currentLink: undefined,
		currentLinkData: undefined,
		currentPage: 'home',
		draggingLink: false
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
	STORE_EXTERNAL_CRATES(state, data) {
		state.externalCrates = data
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
	ADD_EXTERNAL_CRATE(state, crate) {
		state.externalCrates.push(crate)
	},
	REMOVE_CRATE(state, value) {
		state.crates = state.crates.filter((item) => item.id !== value)
	},
	REMOVE_EXTERNAL_CRATE(state, value) {
		state.externalCrates = state.externalCrates.filter((item) => item.id !== value)
	},
	SET_CURRENT_CRATE_LINKS(state, value) {
		state.currentCrateLinks = value
	},
	ADD_CURRENT_CRATE_LINKS(state, value) {
		// Prevent bug where currentCrateLinks is undefined and push fails
		if (!Array.isArray(state.currentCrateLinks)) state.currentCrateLinks = []

		state.currentCrateLinks = state.currentCrateLinks.concat(value)
	},
	ADD_CURRENT_CRATE_LINK(state, value) {
		// Prevent bug where currentCrateLinks is undefined and push fails
		if (!Array.isArray(state.currentCrateLinks)) state.currentCrateLinks = []

		state.currentCrateLinks.unshift(value)
	},
	SET_CURRENT_LINK(state, value) {
		state.currentLink = value
	},
	SET_CURRENT_LINK_DATA(state, value) {
		state.currentLinkData = value
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
	},
	SET_PUBLIC_MODE(state, value) {
		state.publicMode = value
	},
	SET_CONFIG(state, config) {
		state.config = { ...state.config, ...config }
	},
	SET_CURRENT_PAGE(state, value) {
		state.currentPage = value
	},
	SET_DRAGGING_LINK(state, value) {
		state.draggingLink = value
	}
}

export const actions = {
	async GET_CONFIG({ commit }) {
		const config = await this.$api.getConfig()

		commit('SET_CONFIG', config)

		return config
	},
	async ADD_LINK({ commit }, { title, url, crate }) {
		const link = await this.$api.addLinkToCrate(title, url, crate)

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
	async DELETE_EXTERNAL_CRATE({ commit }, crateId) {
		await this.$api.deleteExternalCrate(crateId)

		commit('REMOVE_EXTERNAL_CRATE', crateId)
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
	async ADD_EXTERNAL_CRATE({ commit }, url) {
		const crate = await this.$api.addExternalCrate(url)

		commit('ADD_EXTERNAL_CRATE', crate)

		return crate
	},
	async GET_EXTERNAL_CRATES({ commit }) {
		const crates = await this.$api.getExternalCrates()

		commit('STORE_EXTERNAL_CRATES', crates)
	},
	async GET_CRATES({ commit }, limit) {
		const crates = await this.$api.getCrates(limit)

		commit('STORE_CRATES', crates)
	},
	async CHANGE_CRATE(context, { crateId, changes }) {
		const crate = await this.$api.changeCrate(crateId, changes)

		context.commit('CHANGE_CRATE', crate)
	},
	CHANGE_CRATE_DESCRIPTION: debounce(async function(context, { crateId, description }) {
		const crate = await this.$api.changeCrate(crateId, { description })

		context.commit('CHANGE_CRATE', crate)
	}, debounceThreshold),
	CHANGE_CRATE_NAME: debounce(async function(context, { crateId, name }) {
		const crate = await this.$api.changeCrate(crateId, { name })

		context.commit('CHANGE_CRATE', crate)
	}, debounceThreshold),
	CHANGE_NAME: debounce(async function(context, name) {
		await this.$api.setConfig({ name })
		context.commit('SET_CONFIG', { name })
	}, debounceThreshold),
	async CHANGE_CRATE_ICON(context, { crateId, icon }) {
		const crate = await this.$api.changeCrate(crateId, { icon })

		context.commit('CHANGE_CRATE', crate)
	},
	async CHANGE_CRATE_ACCESS(context, { crateId, isPublic }) {
		const crate = await this.$api.changeCrate(crateId, { public: isPublic })

		context.commit('CHANGE_CRATE', crate)
	},
	CHANGE_LINK: debounce(async function(context, { linkId, changes }) {
		const link = await this.$api.changeLink(linkId, changes)

		context.commit('CHANGE_LINK', link)
	}, debounceThreshold)
}

export const getters = {
	currentCrate: (state) => {
		const crate = state.crates.find((item) => item.id === state.currentCrate)

		if (!crate) return state.externalCrates.find((item) => item.id === state.currentCrate)

		return crate
	},
	findCrateById: (state) => (id) => {
		const crate = state.crates.find((item) => item.id === id)
		if (!crate) return undefined

		return crate
	}
}