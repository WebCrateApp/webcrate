<template>
  <div
    class="menu-item"
    :class="{ 'selected': selected, 'drag': drag, 'hover': hover && drag }"
    @[dropEvent].prevent="onDrop($event)"
    @[dragoverEvent].prevent
    @[dragenterEvent].prevent="hover = true"
    @[dragleaveEvent].prevent="hover = false"
  >
    <div class="item-icon-wrapper">
      <span v-if="selected || hover && drag" class="blurred-icon">{{ emojiIcon }}</span>
      <div v-if="emoji" class="emoji">
        {{ emojiIcon }}
      </div>
      <Icon v-else-if="icon" :name="icon" class="icon" size="20px" />
    </div>
    <span class="name">{{ name }}</span>
    <div v-if="error" class="error">
      <Icon name="error" />
    </div>
  </div>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	props: {
		name: {
			type: String,
			required: true
		},
		selected: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		},
		error: {
			type: Boolean,
			default: false
		},
		count: {
			type: Number,
			default: undefined
		},
		emoji: {
			type: String,
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		},
		crateId: {
			type: String,
			default: undefined
		}
	},
	data() {
		return {
			hover: false
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.emoji]
		},
		dropEvent() {
			return this.editable ? 'drop' : null
		},
		dragoverEvent() {
			return this.editable ? 'dragover' : null
		},
		dragenterEvent() {
			return this.editable ? 'dragenter' : null
		},
		dragleaveEvent() {
			return this.editable ? 'dragleave' : null
		},
		drag() {
			return this.editable && this.$store.state.draggingLink
		}
	},
	methods: {
		async onDrop(e) {
			if (!this.crateId) return
			const linkId = e.dataTransfer.getData('linkId')
			const endpoint = e.dataTransfer.getData('endpoint')

			if (endpoint) {
				const link = await this.$api.getExternalLink(linkId, endpoint)
				const newLink = await this.$api.addLinkToCrate(link.meta && link.meta.title, link.url, this.crateId)

				this.$toast.success('Copied external link!', {
					onClick: () => {
						this.$switchToPageOrCrate(this.crateId, { link: newLink.id })
					}
				})

				return
			}

			this.$store.dispatch('MOVE_LINK', { linkId, crate: this.crateId })
			this.$toast.success('Link moved!', {
				onClick: () => {
					this.$switchToPageOrCrate(this.crateId, { link: linkId })
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.menu-item {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5rem 0.8rem;
		margin-top: 0.2rem;
		background: var(--background-2nd);
		border: 2px solid var(--background-2nd);
		border-radius: var(--border-radius);
		box-sizing: border-box;
		transition: border .2s ease;
		cursor: pointer;
		position: relative;
		overflow: hidden;

		&:hover,
		&.drag {
			border: 2px solid var(--grey);
			transition: none;
		}

		&.hover {
			border: 2px solid var(--grey-2nd);
			transition: none;
		}
	}

	.menu-item * {
		pointer-events: none;
	}

	.selected {
		background: var(--grey);

		& .name {
			color: var(--text-dark);
		}
	}

	.blurred-icon {
		position: absolute;
		left: 1rem;
		top: 35%;
		transform: translateY(-50%) scale(3);
		filter: blur(15px) saturate(4) brightness(2);
		opacity: 0.4;
		z-index: 0;
	}

	.emoji {
		z-index: 1;
		position: relative;
	}

	.name {
		z-index: 1;
	}

	.item-icon-wrapper {
		margin-right: 0.3rem;
		width: 25px;
	}

	.error {
		margin-left: auto;
		color: var(--red);
	}
</style>