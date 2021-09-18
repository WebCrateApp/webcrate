<template>
  <div class="page-wrapper">
    <div v-shortkey="['ctrl', 'a']" @shortkey="showAddLinkModal"></div>
    <div class="title">
      <h1>Inbox</h1>
      <input v-model="newUrl" v-shortkey="['enter']" class="input" placeholder="Quick add a URL" @shortkey="addLink">
      <Actions :actions="actions" />
    </div>
    <hr>
    <div v-if="$fetchState.pending" class="section">
      <h2>Orphaned links</h2>
      <Grid>
        <LinkLoadingItem v-for="idx in 6" :key="'i' + idx" />
      </Grid>
    </div>
    <div v-else-if="links.length > 0" class="section">
      <h2>Orphaned links</h2>
      <GridStack ref="linkGrid" :column-min-width="350" :monitor-images-loaded="true">
        <LinkItem
          v-for="link in links"
          :key="link.id"
          :link="link"
          :draggable="true"
          :show-image="showImages"
          @imageLoaded="reflowGrid"
        />
      </GridStack>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
    </div>
    <div v-else class="empty-state">
      <div class="list">
        <div v-for="i in 3" :key="i" class="empty-link">
          <div class="icon-div"></div>
          <div class="text-div"></div>
        </div>
      </div>
      <h2>{{ emptyMessage }}</h2>
      <p>Drag a link into this crate or add a new one</p>
      <button class="button" @click.stop="showAddLinkModal">
        <Icon name="add" />Add Link
      </button>
    </div>
  </div>
</template>

<script>
/*
	TODO: Refresh recent links when a new link is added
*/
export default {
	layout: 'sidebar',
	asyncData({ app: { $modal }, store, query }) {
		const addUrl = query.addUrl
		const link = query.link

		if (addUrl) {
			$modal.replace('addLink', { inputValue: addUrl })
		} else if (link) {
			$modal.replace('linkDetails', { link })
		}

		store.commit('SET_CURRENT_PAGE', undefined)
		store.commit('SET_CURRENT_CRATE', 'null')
	},
	data() {
		return {
			newUrl: undefined,
			emptyMessages: [
				'Nothing Here',
				'Looks pretty Empty',
				'No Links',
				'*crickets chirping*',
				'Nothing In Here',
				'Add a Link'
			],
			windowSize: undefined,
			lastLink: undefined,
			showImages: false
		}
	},
	async fetch() {
		const res = await this.$api.getOrphanedLinks(20)

		this.$store.commit('SET_CURRENT_CRATE_LINKS', res.data)

		if (res.last) {
			this.lastLink = res.last
		}
	},
	head() {
		return {
			title: 'Inbox | WebCrate',
			link: [
				{ rel: 'icon', type: 'image/icon', href: `/favicon.png` }
			]
		}
	},
	computed: {
		emptyMessage() {
			return this.emptyMessages[Math.floor(Math.random() * this.emptyMessages.length)]
		},
		links: {
			set(value) {
				this.$store.commit('SET_CURRENT_CRATE_LINKS', value)
			},
			get() {
				return this.$store.state.currentCrateLinks
			}
		},
		actions() {
			return [
				{
					id: 'addLink',
					text: 'Add Link',
					icon: 'add',
					click: this.addLink,
					show: true,
					showText: this.windowSize >= 600,
					dropdown: this.windowSize <= 450
				},
				{
					id: 'changeView',
					text: 'Show images',
					icon: 'image',
					click: this.changeGridView,
					show: !this.showImages,
					dropdown: true
				},
				{
					id: 'changeView',
					text: 'Hide images',
					icon: 'image',
					click: this.changeGridView,
					show: this.showImages,
					dropdown: true
				}
			]
		},
		numLinks() {
			return this.links.length
		}
	},
	watch: {
		showImages(newValue) {
			this.$storage.set(this.$storage.types.SHOW_IMAGES_IN_LIST, newValue)
		},
		// Try to catch edge case where links are added/removed but the grid doesn't detect it
		numLinks(newValue, oldValue) {
			if (newValue && newValue !== oldValue && this.$refs.linkGrid) {
				this.reflowGrid()
			}
		}
	},
	mounted() {
		this.onResize()
		window.addEventListener('resize', this.onResize)

		const showImages = this.$storage.get(this.$storage.types.SHOW_IMAGES_IN_LIST, true)
		this.showImages = showImages
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		addLink() {
			if (!this.newUrl) {
				this.showAddLinkModal()

				return
			}

			const url = this.newUrl

			this.$store.dispatch('ADD_LINK', { url }).then((link) => {
				this.newUrl = undefined
				this.links.unshift(link)

				this.$toast.success('Link added!', {
					onClick: () => {
						this.$modal.show('linkDetails', { link: link.id })
					}
				})
			}).catch((err) => {
				console.log(err)
			})
		},
		showAddLinkModal() {
			this.$modal.show('addLink')
		},
		async infiniteHandler($state) {
			if (!this.lastLink) return $state.complete()

			const res = await this.$api.getOrphanedLinks(20, this.lastLink)

			if (res.data && res.data.length > 0) {
				this.$store.commit('ADD_CURRENT_CRATE_LINKS', res.data)
			}

			if (res.last) {
				this.lastLink = res.last
				$state.loaded()
			} else {
				$state.complete()
			}
		},
		onResize() {
			this.windowSize = window.innerWidth
		},
		reflowGrid() {
			this.$refs.linkGrid.update()
		},
		changeGridView() {
			this.showImages = !this.showImages
		}
	}
}

</script>

<style lang="scss" scoped>
	.page-wrapper {
		padding: 2rem;

		& hr {
			margin-top: 0.5rem;
		}
	}

	@media only screen and (max-width: 900px) {
		.page-wrapper {
			padding: 1.5rem;
		}
	}

	.title {
		display: flex;
		align-items: center;
		width: 100%;

		& h1 {
			font-size: 1.4rem;
			flex-shrink: 0;
			color: var(--text);
		}

		& input {
			max-width: 400px;
			margin: auto;
		}

		& button {
			margin-left: auto;
			display: flex;
			align-items: center;
			flex-shrink: 0;
		}
	}

	.section {
		margin-top: 1rem;

		& h2 {
			font-size: 1.1rem;
			font-weight: 550;
			color: var(--text-light);
			margin-bottom: 1rem;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 4rem;

		& .link-icon {
			color: var(--text-light);
		}

		& h2 {
			margin-top: 1rem;
		}

		& p {
			margin-top: 0.5rem;
		}

		& button {
			display: flex;
			align-items: center;
			margin: auto;
			margin-top: 1rem;

			& div {
				margin-right: 0.5rem;
			}
		}

		& .list {
			max-width: 200px;
			width: 80%;
		}

		& .empty-link {
			width: 100%;
			height: 35px;
			background: var(--background-2nd);
			border-radius: var(--border-radius);
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0.5rem;
			margin-bottom: 0.5rem;

			& .icon-div {
				height: 100%;
				width: 20px;
				background: var(--grey-light);
				border-radius: var(--border-radius);
			}

			& .text-div {
				height: 100%;
				flex-grow: 1;
				background: var(--grey-light);
				border-radius: var(--border-radius);
				margin-left: 0.5rem;
			}
		}
	}

	@media only screen and (max-width: 1100px) {
		.title input {
			display: none;
		}
	}
</style>