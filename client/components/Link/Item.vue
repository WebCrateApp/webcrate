<template>
  <div
    :draggable="draggable"
    title="Click to open link details"
    @[dragStartEvent].stop="startDrag($event)"
    @[dragStopEvent].stop="stopDrag($event)"
    @click.stop="openLinkDetails"
    @click.middle="openLinkPage"
  >
    <div class="link-item" @mouseover="hover = true" @mouseleave="hover = false">
      <Img v-if="showImage && link.meta && link.meta.image" :src="imageUrl" class="image" @loaded="imageLoaded" />
      <h4>{{ link.meta && link.meta.title }}</h4>
      <div class="domain-wrapper">
        <Img v-if="link.meta && link.meta.icon" :src="iconUrl" />
        <p>{{ domain }}</p>
      </div>
      <span>{{ new Date(link.addedAt).toLocaleString() }}</span>
      <a :href="link.url" target="_blank" rel="noopener" @click.stop>
        <Icon v-if="hover" name="externalLink" class="delete-icon" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
	// eslint-disable-next-line vue/require-prop-types
	props: {
		link: {
			type: Object,
			required: true
		},
		draggable: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: true
		},
		showImage: {
			type: Boolean,
			default: false
		},
		endpoint: {
			type: String,
			default: undefined
		}
	},
	data() {
		return {
			hover: false,
			imageError: false
		}
	},
	computed: {
		domain() {
			try {
				return new URL(this.link.url).host
			} catch (err) {
				return undefined
			}
		},
		iconUrl() {
			if (this.endpoint) {
				return `https://${ this.endpoint }/img/${ this.link.id }?type=icon`
			} else {
				return `/img/${ this.link.id }?type=icon`
			}
		},
		imageUrl() {
			if (this.endpoint) {
				return `https://${ this.endpoint }/img/${ this.link.id }?type=image`
			} else {
				return `/img/${ this.link.id }?type=image`
			}
		},
		dragStartEvent() {
			return this.draggable ? 'dragstart' : null
		},
		dragStopEvent() {
			return this.draggable ? 'dragend' : null
		},
		drag: {
			set(value) {
				this.$store.commit('SET_DRAGGING_LINK', value)
			},
			get() {
				return this.$store.state.draggingLink
			}
		}
	},
	methods: {
		openLinkDetails() {
			if (window.innerWidth < 500) {
				this.openLinkPage()
				return
			}

			this.$modal.show('linkDetails', { link: this.link.id, editable: this.editable, endpoint: this.endpoint })
		},
		openLinkPage() {
			this.$switchToPageOrCrate(this.link.id, { fullPage: true, isPublic: !this.endpoint && !this.editable, newTab: true })
		},
		startDrag(e) {
			this.drag = true
			e.dataTransfer.dropEffect = 'move'
			e.dataTransfer.effectAllowed = 'move'
			e.dataTransfer.setData('linkId', this.link.id)

			if (this.endpoint) {
				e.dataTransfer.setData('endpoint', this.endpoint)
			}
		},
		stopDrag() {
			this.drag = false
		},
		// When the image is loaded we need to reflow the grid
		imageLoaded() {
			this.$emit('imageLoaded')
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-item {
		border-radius: var(--border-radius);
		padding: 1rem;
		background: var(--background-2nd);
		border: 2px solid var(--background-2nd);
		transition: border .2s ease;
		cursor: pointer;
		position: relative;

		& span {
			color: var(--text-light);
			display: block;
			font-size: 0.9rem;
		}

		&:hover {
			border: 2px solid var(--grey);
			transition: none;
		}

		.domain-wrapper {
			display: flex;
			align-items: center;

			& img {
				width: 15px;
				height: 15px;
				margin-right: 0.3rem;
			}
		}

		.image {
			width: 100%;
			border-radius: var(--border-radius);
			margin-bottom: 0.5rem;
		}
	}

	.delete-icon {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		color: var(--text-light);
	}
</style>