<template>
  <img :src="imageSrc" :class="!loaded && 'loading'" @error="onError" @load="onLoad">
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			imageError: false,
			loaded: false
		}
	},
	computed: {
		imageSrc() {
			if (this.imageError) return '/missingFavicon.png'

			return this.src
		}
	},
	methods: {
		onError() {
			this.imageError = true
			this.$emit('fail')
		},
		onLoad() {
			this.loaded = true
			this.$emit('loaded')
		}
	}
}
</script>

<style scoped>
	.loading {
		display: none;
	}
</style>