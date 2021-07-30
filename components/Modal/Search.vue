<template>
  <Modal class="search-modal" @close="close">
    <h1>Quick Search</h1>
    <input v-model="searchValue" v-focus class="input" placeholder="Search for a link or crate by their name, description, icon or URL">
    <div v-if="loading">
      <LoadingItem v-for="idx in 3" :key="'i' + idx" />
    </div>
    <div v-else-if="links.length === 0 && crates.length === 0 && searchValue" class="nothing">
      <p>{{ emptyMessage }}</p>
    </div>
    <div v-else-if="searchValue">
      <div v-if="crates.length > 0" class="section">
        <h2>Crates</h2>
        <CrateListItem v-for="crate in crates" :key="crate.id" :icon="crate.icon" :name="crate.name" @click.native.stop="changeCrate(crate)" />
      </div>
      <div v-if="links.length > 0" class="section">
        <h2>Links</h2>
        <LinkListItem
          v-for="link in links"
          :id="link.id"
          :key="link.id"
          :title="link.meta.title"
          :url="link.url"
          :icon="link.meta && link.meta.icon"
          @click.native.stop="openLink(link)"
        />
      </div>
    </div>
  </Modal>
</template>

<script>
import debounce from 'underscore/modules/debounce'

export default {
	data() {
		return {
			searchValue: undefined,
			links: [],
			crates: [],
			emptyMessages: [
				'Nothing found',
				'*crickets chirping*',
				'No results',
				'No links or crates found'
			],
			loading: false,
			first: true
		}
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		emptyMessage() {
			return this.emptyMessages[Math.floor(Math.random() * this.emptyMessages.length)]
		}
	},
	watch: {
		searchValue(value) {
			if (this.first) this.loading = true
			this.search(value)
		}
	},
	methods: {
		close() {
			this.$modal.hide()
		},
		search: debounce(async function(value) {
			if (!value) return

			this.loading = true
			this.first = false

			const data = await this.$api.search(value)

			this.links = data.links
			this.crates = data.crates

			this.loading = false
		}, 500),
		changeCrate(crate) {
			this.$switchToPageOrCrate(crate.id)
			this.close()
		},
		openLink(link) {
			const currentCrate = this.currentCrate && this.currentCrate.id
			if (link.crate && (link.crate !== currentCrate)) {
				this.$switchToPageOrCrate(link.crate, { link: link.id })
			} else {
				this.$modal.replace('linkDetails', { link: link.id })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.search-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

		& input {
			margin-bottom: 1rem;
		}

		.section {
			display: flex;
			flex-direction: column;
			justify-content: center;

			& h2 {
				font-size: 1rem;
				color: var(--text-light);
				margin-bottom: 0.5rem;
				margin-top: 0.5rem;
			}
		}

		.nothing {
			color: var(--text-light);
		}
	}
</style>