<template>
  <Modal
    class="image-modal"
    max-width="unset"
    min-height="unset"
    width="unset"
    overflow="hidden"
    padding="0"
    :centered="true"
    @close="close"
  >
    <div>
      <img :src="src">
    </div>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			canClose: false
		}
	},
	computed: {
		src: {
			set(value) {
				this.$modal.setData({ src: value })
			},
			get() {
				return this.$store.state.modal.data.src
			}
		}
	},
	created() {
		// Prevent other old click events from closing modal
		setTimeout(() => {
			this.canClose = true
		}, 200)
	},
	methods: {
		close() {
			if (this.canClose) {
				this.$modal.hide('viewImage')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.image-modal {
		img {
			max-width: 85vw;
			max-height: 85vh;
			display: block;
		}
	}
</style>