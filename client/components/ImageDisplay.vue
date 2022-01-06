<template>
  <div v-if="!imageError" ref="wrapper" class="image-wrapper" :class="{ 'loading': loading, 'transition': useTransition }" :style="{ '--resize': resize }">
    <LoadingItem v-if="loading" height="100%" width="100%" />
    <div class="image" @click.stop="openFullscreen">
      <img ref="img" :src="src" @error="onError" @load="onLoad">
    </div>
  </div>
</template>

<script>
/*
Image Display Component:
- Shows loader while image is loading
- Adds an expand animation on slow connection (i.e. after delay)
- Hides itself is the image fails to load
- Shows fullscreen image on click
- Can be resized while keeping the original aspect ratio
*/
export default {
	props: {
		src: {
			type: String,
			required: true
		},
		defaultHeight: {
			type: Number,
			default: 300
		},
		resize: {
			type: String,
			default: 'both'
		}
	},
	data() {
		return {
			imageError: false,
			loading: true,
			observer: undefined,
			transitionTimeout: undefined,
			useTransition: false
		}
	},
	mounted() {
		// Observe any image resizes
		this.observer = new ResizeObserver(this.onResize)
		this.observer.observe(this.$refs.img)

		// Only apply the transition after a small delay to make sure the image loads instantly on a fast connection
		this.transitionTimeout = setTimeout(() => {
			this.useTransition = true
		}, 500)
	},
	beforeDestroy() {
		if (this.observer && this.$refs.img) this.observer.unobserve(this.$refs.img)
	},
	methods: {
		onResize() {
			// Prevent edge case where img and wrapper don't exist yet
			if (!this.$refs.img || !this.$refs.wrapper) return

			// Ignore any resizes during loading
			if (this.loading) return

			// Limit the wrappers height to the image's height
			this.$refs.wrapper.style.maxHeight = `${ this.$refs.img.offsetHeight }px`
		},
		onError() {
			this.stopLoading()

			this.imageError = true
			this.$emit('fail')
		},
		onLoad() {
			// Prevent edge case where img and wrapper don't exist yet
			if (!this.$refs.img || !this.$refs.wrapper) return

			// Set/limit the elements height to the default height after load
			const imageHeight = this.$refs.img.offsetHeight
			if (imageHeight < this.defaultHeight) {
				this.$refs.wrapper.style.height = `${ imageHeight }px`
				this.$refs.wrapper.style.maxHeight = `${ imageHeight }px`
			} else {
				this.$refs.wrapper.style.height = `${ this.defaultHeight }px`
				this.$refs.wrapper.style.maxHeight = `${ imageHeight }px`
			}

			this.stopLoading()
			this.$emit('loaded')
		},
		stopLoading() {
			this.loading = false

			// Clear transition timeout in case it's still running
			clearTimeout(this.transitionTimeout)

			// Add small delay to wait for the transition to finish and then disable it so it doesn't apply to the resize
			setTimeout(() => {
				this.useTransition = false
			}, 500)
		},
		openFullscreen() {
			if (this.loading) return

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
		max-width: 100%;
		height: 50px; // Will be the height of the loader
		position: relative;

		&.transition {
			transition: height .2s ease;
		}

		&.loading {
			resize: none;
			background: none;
		}
	}

	.icon-wrapper {
		color: var(--text-dark);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.loading .image {
		opacity: 0;
		cursor: initial;
	}

	.image {
		max-width: 100%;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity .2s ease;

		& img {
			width: 100%;
			height: 100%;
			pointer-events: none;
		}
	}
</style>