<template>
  <div class="page-wrapper">
    <div v-shortkey="['ctrl', 'a']" @shortkey="showAddLinkModal"></div>
    <div class="title">
      <h1>{{ welcomeMessage }}</h1>
      <input v-model="newUrl" v-shortkey="shortKey" class="input" placeholder="Quick add a URL" @shortkey="addLink">
      <button class="button add-btn" @click.stop="addLink">
        <Icon name="add" />
        <span>Add Link</span>
      </button>
    </div>
    <hr>
    <transition name="fade">
      <div v-if="loadingCrates" class="section">
        <h2>Recently used crates</h2>
        <Grid>
          <CrateLoadingItem v-for="idx in 4" :key="'i' + idx" />
        </Grid>
      </div>
      <div v-else-if="crates && crates.length > 0" class="section">
        <h2>Recently used crates</h2>
        <Grid max-width="300px">
          <CrateItem v-for="crate in crates" :key="crate.id" :crate="crate" />
        </Grid>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="loadingLinks" class="section">
        <h2>Recently added links</h2>
        <Grid>
          <LinkLoadingItem v-for="idx in 4" :key="'i' + idx" />
        </Grid>
      </div>
      <div v-else-if="links && links.length > 0" class="section">
        <h2>Recently added links</h2>
        <GridStack ref="linkGrid" :column-min-width="350" :monitor-images-loaded="true">
          <LinkItem v-for="link in links" :key="link.id" :link="link" :draggable="true" />
        </GridStack>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="(!crates || crates.length < 1) && (!links || links.length < 1) && !loadingCrates && !loadingLinks" class="empty-state">
        <Icon name="book" size="50px" />
        <h2>Get started with WebCrate</h2>
        <p>
          Looks like it's the first time you are using WebCrate, start by adding your first link!
          <br>If you don't have a link ready, use the example instead.
        </p>
        <div class="add-buttons">
          <button class="primary-button" @click.stop="showAddLinkModal">
            <Icon name="add" />Add first link
          </button>
          <p>or</p>
          <button class="button" @click.stop="addExampleLink">
            <Icon name="info" />Use example
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
	layout: 'sidebar',
	asyncData({ app: { $modal }, query }) {
		const addUrl = query.addUrl
		const link = query.link

		if (addUrl) {
			$modal.replace('addLink', { inputValue: addUrl })
		} else if (link) {
			$modal.replace('linkDetails', { link })
		}

		// Web Share Target API
		const { searchParams } = new URL(window.location)
		let sharedUrl = ''

		const validateUrl = (string) => {
			let url

			try {
				url = new URL(string)
			} catch (_) {
				return false
			}

			return url.protocol === 'http:' || url.protocol === 'https:'
		}

		if (searchParams.get('url') && validateUrl(searchParams.get('url'))) {
			sharedUrl = searchParams.get('url')
		} else if (searchParams.get('text') && validateUrl(searchParams.get('text'))) {
			sharedUrl = searchParams.get('text')
		} else if (searchParams.get('title') && validateUrl(searchParams.get('title'))) {
			sharedUrl = searchParams.get('title')
		}

		if (sharedUrl) {
			$modal.replace('addLink', { inputValue: sharedUrl })
		}
	},
	data() {
		return {
			welcomeMessages: [
				'Welcome back!',
				'Good day!',
				'How\'s it going?',
				'What up?',
				'Great to see you!'
			],
			emptyMessages: [
				'Nothing Here',
				'Looks pretty Empty',
				'No Links',
				'*crickets chirping*',
				'Nothing In Here',
				'Add a Link'
			],
			newUrl: undefined,
			loadingLinks: true,
			loadingCrates: true,
			crates: []
		}
	},
	async fetch() {
		const crates = await this.$api.getRecentCrates()
		this.crates = crates
		this.loadingCrates = false

		const links = await this.$api.getRecentLinks()
		this.$store.commit('SET_CURRENT_CRATE_LINKS', links)
		this.loadingLinks = false
	},
	head() {
		return {
			title: 'Home | WebCrate',
			link: [
				{ rel: 'icon', type: 'image/icon', href: `/favicon.png` }
			]
		}
	},
	computed: {
		welcomeMessage() {
			return this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)]
		},
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
		shortKey() {
			if (this.newUrl) {
				return [ 'enter' ]
			}

			return undefined
		}
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
		addExampleLink() {
			this.$modal.show('addLink', { inputValue: 'https://www.deta.sh' })
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

			& span {
				margin-left: 0.5rem;
			}
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

		& h2 {
			margin-top: 1rem;
			font-size: 1.3rem;
			font-weight: 550;
		}

		& p {
			margin-top: 0.5rem;
			color: var(--text-light);
			max-width: 600px;
			text-align: center;
		}

		.add-buttons {
			display: flex;
			align-items: center;

			& p {
				margin-left: 1rem;
				margin-right: 1rem;
			}
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
	}

	@media only screen and (max-width: 1100px) {
		.title input {
			display: none;
		}
	}
</style>