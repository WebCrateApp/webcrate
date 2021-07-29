<template>
  <div class="menu-item" :class="{ 'selected': selected, 'hover': drag && editable }" @[dropEvent].prevent="onDrop($event)" @[dragoverEvent].prevent @[dragenterEvent].prevent>
    <div class="item-icon-wrapper">
      <div v-if="emoji" class="emoji">
        {{ emojiIcon }}
      </div>
      <Icon v-else-if="icon" :name="icon" class="icon" size="20px" />
    </div>
    <span>{{ name }}</span>
    <div v-if="count" class="count">
      <span>{{ count }}</span>
    </div>
  </div>
</template>

<script>
import emojis from '../../server/utils/emojis'

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
		drag() {
			return this.$store.state.draggingLink
		}
	},
	methods: {
		async onDrop(e) {
			if (!this.crateId) return
			const linkId = e.dataTransfer.getData('linkId')
			const endpoint = e.dataTransfer.getData('endpoint')

			if (endpoint) {
				const link = await this.$api.getExternalLink(linkId, endpoint)

				await this.$api.addLinkToCrate(link.url, this.crateId)

				// this.$modal.show('linkDetails', { link: newLink.id })

				/* this.$store.commit('SET_CURRENT_CRATE', this.crateId)
				this.$router.push(`/crate/${ this.crateId }`)
 */
				return
			}

			this.$store.dispatch('MOVE_LINK', { linkId, crate: this.crateId })
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

		&:hover,
		&.hover {
			border: 2px solid var(--grey);
			transition: none;
		}
	}

	.selected {
		background: var(--grey);
	}

	.item-icon-wrapper {
		margin-right: 0.3rem;
		width: 25px;
	}

	.count {
		margin-left: auto;
		display: flex;
		justify-content: center;
		align-items: center;

		& span {
			font-size: 0.8rem;
		}
	}
</style>