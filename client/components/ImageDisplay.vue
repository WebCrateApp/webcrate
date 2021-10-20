<template>
  <div class="image-wrapper" :style="{ '--max-height': maxHeight, '--resize': resize }">
    <div class="image" @click.stop="fullscreen">
      <img :src="src" :class="!loaded && 'loading'" @error="onError" @load="onLoad">
    </div>
  </div>
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true
		},
		maxHeight: {
			type: String,
			default: '300px'
		},
		resize: {
			type: String,
			default: 'vertical'
		}
	},
	data() {
		return {
			imageError: false,
			loaded: false
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
		},
		fullscreen() {
			this.$emit('fullscreen')
			this.$modal.show('viewImage', { src: this.src })
		}
	}
}
</script>

<style lang="scss" scoped>
	.image-wrapper {
			margin: auto;
			margin-top: 1rem;
			margin-bottom: 1rem;
			background: var(--background-2nd);
			overflow: hidden;
			border-radius: var(--border-radius);
			resize: var(--resize);
			height: var(--max-height);
			max-width: 100%;
		}

		.image {
			max-width: 100%;
			max-height: 100%;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			& img {
				width: 100%;
				height: 100%;
				pointer-events: none;
			}
		}
</style>