<template>
  <Modal class="link-details-modal" width="1200px" @close="close">
    <div v-if="link.url">
      <h1>{{ link.meta.title || 'Link Title' }}</h1>
      <a :href="link.url" target="_blank" rel="noopener">
        {{ link.url }}
      </a>
      <div v-if="link.meta.image" class="image-wrapper">
        <div class="image">
          <img :src="`/img/${ link.id }`">
        </div>
      </div>
      <p>{{ link.meta.description || 'Link description' }}</p>
    </div>
    <p v-else>
      {{ link }}
    </p>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			searchValue: undefined
		}
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		link() {
			return this.$store.state.modal.data.link
		},
		domain() {
			return new URL(this.link.url).host
		}
	},
	created() {
		const query = Object.assign({}, this.$route.query)
		query.link = this.link.id || this.link
		this.$router.push({ query })
	},
	beforeDestroy() {
		const query = Object.assign({}, this.$route.query)
		delete query.link
		this.$router.push({ query })
	},
	methods: {
		close() {
			this.$modal.hide()
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
		max-height: 500px;
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
</style>