<template>
  <Modal class="search-modal" @close="close">
    <h1>Quick Search</h1>
    <input v-model="searchValue" class="input" placeholder="Search for a link or crate by their name, description, icon or URL">
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
	<div v-if="links.length === 0 && crates.length === 0 && searchValue" class="nothing">
	  <p>{{ emptyMessage }}</p>
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
			]
		}
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		searchItems() {
			return this.$api.search(this.searchValue)
		},
		emptyMessage() {
			return this.emptyMessages[Math.floor(Math.random() * this.emptyMessages.length)]
		}
	},
	watch: {
		searchValue(value) {
			this.search(value)
		}
	},
	methods: {
		close() {
			this.$modal.hide()
		},
		search: debounce(async function(value) {
			if (!value) return

			const data = await this.$api.search(value)

			this.links = data.links
			this.crates = data.crates
		}, 500),
		changeCrate(crate) {
			this.$store.commit('SET_CURRENT_CRATE', crate.id)
			this.$router.push(`/crate/${ crate.id }`)
			this.close()
		},
		openLink(link) {
			const currentCrate = this.currentCrate && this.currentCrate.id
			if (link.crate && (link.crate !== currentCrate)) {
				this.$store.commit('SET_CURRENT_CRATE', link.crate)
				this.$router.push(`/crate/${ link.crate }?link=${ link.id }`)
			} else {
				this.$modal.show('linkDetails', { link: link.id })
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