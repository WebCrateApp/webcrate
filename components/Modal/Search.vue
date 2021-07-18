<template>
  <Modal class="search-modal" @close="close">
    <h1>Quick Search</h1>
    <input v-model="searchValue" class="input" placeholder="Search for a link or crate by their name, description, icon or URL">
    <div v-if="crates.length > 0" class="section">
      <h2>Crates</h2>
      <div v-for="crate in crates" :key="crate.id" class="crate-item" @click.stop="changeCrate(crate)">
        <p><span>{{ emojiIcon(crate.icon) }}</span>{{ crate.name }}</p>
      </div>
    </div>
    <div v-if="links.length > 0" class="section">
      <h2>Links</h2>
      <div v-for="link in links" :key="link.id" class="link-item" @click.stop="openLink(link)">
        <p>{{ link.meta.title }}</p>
        <p class="domain">
          {{ domain(link.url) }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script>
import debounce from 'underscore/modules/debounce'
import emojis from '../../server/utils/emojis'

export default {
	data() {
		return {
			searchValue: undefined,
			links: [],
			crates: []
		}
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		searchItems() {
			return this.$api.search(this.searchValue)
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
		},
		emojiIcon(icon) {
			return emojis[icon]
		},
		domain(url) {
			return new URL(url).host
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

		.crate-item {
			padding: 0.5rem;
			border-radius: var(--border-radius);
			transition: background .2s ease;
			cursor: pointer;

			& span {
				margin-right: 0.5rem;
			}

			&:hover {
				background: var(--background-2nd);
				transition: none;
			}
		}

		.link-item {
			padding: 0.5rem;
			border-radius: var(--border-radius);
			transition: background .2s ease;
			cursor: pointer;
			padding-left: 1rem;

			.domain {
				color: var(--text-light);
			}

			&:hover {
				background: var(--background-2nd);
				transition: none;
			}
		}
	}
</style>