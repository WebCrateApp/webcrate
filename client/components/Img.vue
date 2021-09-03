<template>
  <img :src="imageSrc" @error="imageError = true">
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
			imageError: false
		}
	},
	computed: {
		imageSrc() {
			if (this.imageError) return '/missingFavicon.png'

			return this.src
		}
	}
}
</script>