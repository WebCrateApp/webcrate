<template>
  <Modal class="link-details-modal" @close="close">
    <h1>Link Details</h1>
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
		currentCrate() {
			return this.$store.getters.currentCrate
		}
	},
	methods: {
		close() {
			this.$modal.hide()
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-details-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}
	}
</style>