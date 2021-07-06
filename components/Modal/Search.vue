<template>
  <Modal class="search-modal" @close="showSearchModal = false">
    <h1>Quick Search</h1>
    <input v-model="searchValue" class="input" :placeholder="`Search ${ currentCrate ? currentCrate.name : 'everything' }`">
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			searchValue: undefined
		}
	},
	computed: {
		showSearchModal: {
			set(value) {
				this.$store.commit('SET_SHOW_SEARCH_MODAL', value)
			},
			get() {
				return this.$store.state.showSearchModal
			}
		},
		currentCrate() {
			return this.$store.state.currentCrate
		}
	}
}
</script>

<style lang="scss" scoped>
	.search-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

		& input {
			margin-bottom: 1rem;
		}
	}
</style>