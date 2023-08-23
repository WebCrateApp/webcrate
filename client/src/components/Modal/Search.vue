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
        <CrateListItem
          v-for="crate in crates"
          :key="crate.id"
          :icon="crate.icon"
          :name="crate.name"
          @click.native.stop="changeCrate(crate)"
          @click.middle.native.stop="changeCrate(crate, true)"
        />
      </div>
      <div v-if="links.length > 0" class="section" infinite-wrapper="test">
        <h2>Links</h2>
        <LinkListItem
          v-for="link in links"
          :id="link.id"
          :key="link.id"
          :title="link.meta.title"
          :url="link.url"
          :icon="link.meta && link.meta.icon"
          :crate="link.crate && getCrate(link.crate)"
          @click.native.stop="openLink(link)"
          @click.middle.native.stop="openLink(link, true)"
        />
        <div v-if="lastLink" class="more">
          <button class="no-button" @click="loadMore">
            Load more
          </button>
        </div>
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
				'No results',
				'No links or crates found'
			],
			loading: false,
			first: true,
			lastLink: undefined
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

			const data = await this.$api.search(value, this.lastLink)
			if (data.last) {
				this.lastLink = data.last
			} else {
				this.lastLink = undefined
			}

			this.links = data.links
			this.crates = data.crates

			this.loading = false
		}, 500),
		changeCrate(crate, newTab = false) {
			this.$switchToPageOrCrate(crate.id, { newTab })

			if (!newTab) {
				this.close()
			}
		},
		openLink(link, newTab = false) {
			const currentCrate = this.currentCrate && this.currentCrate.id

			if (newTab) {
				this.$switchToPageOrCrate(link.id, { fullPage: true, newTab: true })
			} else if (window.innerWidth < 500) {
				this.$switchToPageOrCrate(link.id, { fullPage: true, newTab })
				this.$modal.hide()
			} else if (link.crate && (link.crate !== currentCrate)) {
				this.$switchToPageOrCrate(link.crate, { link: link.id, newTab })
			} else {
				this.$modal.replace('linkDetails', { link: link.id })
			}
		},
		getCrate(id) {
			return this.$store.getters.findCrateById(id)
		},
		async loadMore() {
			if (!this.lastLink) return

			const data = await this.$api.search(this.searchValue, this.lastLink)

			if (data.links && data.links.length > 0) {
				this.links = this.links.concat(data.links)
			}

			if (data.last) {
				this.lastLink = data.last
			} else {
				this.lastLink = undefined
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.search-modal {
		overflow-y: auto;
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

		.more {
			padding: 0.5rem;
			padding-left: 1rem;

			& button {
				color: var(--text-light);
				font-size: 1rem;
			}
		}

		.nothing {
			color: var(--text-light);
		}
	}
</style>