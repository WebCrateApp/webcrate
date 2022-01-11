<template>
  <img v-show="show" :src="imageSrc" :class="!loaded && 'loading'" @error="onError" @load="onLoad">
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true
		},
		fallback: {
			type: [ String, Boolean ],
			default: '/missingFavicon.png'
		}
	},
	data() {
		return {
			imageError: false,
			loaded: false,
			show: true
		}
	},
	computed: {
		imageSrc() {
			if (this.imageError) return this.fallback

			return this.src
		}
	},
	methods: {
		onError(e) {
			this.imageError = true
			this.$emit('fail', e)

			if (!this.fallback) this.show = false
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