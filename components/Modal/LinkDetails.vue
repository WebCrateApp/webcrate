<template>
  <Modal class="link-details-modal" width="1000px" @close="close">
    <p v-if="$fetchState.pending ">
      Loading link...
    </p>
    <div v-else-if="link">
      <div class="top">
        <div class="title">
          <h1>{{ link.meta.title || 'Link Title' }}</h1>
          <a :href="link.url" target="_blank" rel="noopener">
            {{ link.url }}
          </a>
        </div>
        <button class="button delete-btn" @click.stop="deleteLink">
          <Icon name="delete" />
        </button>
      </div>
      <div v-if="link.meta.image" class="image-wrapper">
        <div class="image">
          <img :src="`/img/${ link.id }`">
        </div>
      </div>
      <p class="description">
        {{ link.meta.description || 'Link description' }}
      </p>
    </div>
    <p v-else>
      Error
    </p>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			link: undefined,
			canClose: true
		}
	},
	async fetch() {
		const link = await this.$api.getLink(this.linkId)
		this.link = link
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		linkId() {
			return this.$store.state.modal.data.link
		},
		domain() {
			return new URL(this.link.url).host
		}
	},
	created() {
		const query = Object.assign({}, this.$route.query)
		if (!query.link) {
			query.link = this.linkId
			this.$router.push({ query })
		}
	},
	beforeDestroy() {
		const query = Object.assign({}, this.$route.query)
		delete query.link
		this.$router.push({ query })
	},
	methods: {
		close() {
			if (this.canClose) {
				this.$modal.hide()
			}
		},
		async deleteLink() {
			this.canClose = false
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this link?`,
				confirmText: 'Delete Link'
			})

			if (!confirm) {
				setTimeout(() => {
					this.canClose = true
				}, 500)

				return
			}

			this.$store.dispatch('DELETE_LINK', this.link.id)
			this.canClose = true
			this.close()
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-details-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 0;
		}

		& a {
			color: var(--text-light);
			margin-top: 0rem;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.image-wrapper {
		margin-top: 1rem;
		margin-bottom: 1rem;
		background: var(--background-2nd);
		overflow: hidden;
		border-radius: var(--border-radius);
		resize: vertical;
	}

	.image {
		max-width: 100%;
		max-height: 300px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		& img {
			width: 100%;
			height: 100%;
			pointer-events: none;
		}
	}

	.top {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;

		.title {
			flex-grow: 1;
		}

		.delete-btn {
			margin-left: auto;
		}
	}

	.description {
		margin-top: 0.5rem;
	}
</style>