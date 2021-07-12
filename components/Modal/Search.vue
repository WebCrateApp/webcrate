<template>
  <Modal class="search-modal" @close="showModal = false">
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
		showModal: {
			set(show) {
				this.$modal.set('search', show)
			},
			get() {
				return this.$store.state.modals.search
			}
		},
		currentCrate() {
			return this.$store.getters.currentCrate
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