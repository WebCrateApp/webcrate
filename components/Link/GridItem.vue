<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener"
    draggable
    @dragstart.stop="startDrag($event)"
  >
    <div class="link-item" @mouseover="hover = true" @mouseleave="hover = false">
      <h4>{{ link.meta && link.meta.title }}</h4>
      <p>{{ domain }}</p>
      <span>{{ new Date(link.addedAt).toLocaleString() }}</span>
      <Icon v-if="hover" name="delete" class="delete-icon" @click.native.stop.prevent="deleteLink" />
    </div>
  </a>
</template>

<script>
export default {
	// eslint-disable-next-line vue/require-prop-types
	props: [ 'link' ],
	data() {
		return {
			hover: false,
			drag: false
		}
	},
	computed: {
		domain() {
			return new URL(this.link.url).host
		}
	},
	methods: {
		async deleteLink() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this link?`,
				confirmText: 'Delete Link'
			})

			if (confirm) {
				this.$store.dispatch('DELETE_LINK', this.link.key)
			}
		},
		startDrag(e) {
			this.drag = true
			e.dataTransfer.dropEffect = 'move'
			e.dataTransfer.effectAllowed = 'move'
			e.dataTransfer.setData('linkId', this.link.key)
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
	}

	.delete-icon {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		color: var(--text-light);
	}
</style>