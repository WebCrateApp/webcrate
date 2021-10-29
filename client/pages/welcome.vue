<template>
  <div class="page-wrapper">
    <ModalAddCrate v-if="showModal && showModal.addCrate" />
    <ModalLinkDetails v-else-if="showModal && showModal.linkDetails" />
    <ModalAddLink v-else-if="showModal && showModal.addLink" />
    <div v-if="state !== 'load'" class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="165" height="36" viewBox="0 0 165 36">
        <defs>
          <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#f5be6b" />
            <stop offset="1" stop-color="#df9930" />
          </linearGradient>
        </defs>
        <g id="Rechteck_532" data-name="Rechteck 532" stroke="#f5be6b" stroke-width="5" fill="url(#linear-gradient)">
          <rect width="36" height="36" rx="7" stroke="none" />
          <rect
            x="2.5"
            y="2.5"
            width="31"
            height="31"
            rx="4.5"
            fill="none"
          />
        </g>
        <text
          id="WebCrate"
          transform="translate(48 28)"
          fill="#474440"
          font-size="26"
          font-family="SegoeUI-Semibold, Segoe UI"
          font-weight="600"
        ><tspan x="0" y="0">WebCrate</tspan></text>
      </svg>
    </div>
    <div v-if="state === 'load'" class="welcome">
      <h1>Welcome to WebCrate 👋</h1>
      <p>Organize and share links from around the web.</p>
      <button class="primary-button" @click="state = 'name'">
        Start Setup
      </button>
      <p class="light">
        It only takes a few seconds!
      </p>
      <div>
        <div class="features">
          <WelcomeFeature title="Private" description="This is your own instance of WebCrate" icon="lockClosed" href="https://webcrate.app/docs/faq#whats-deta-space" />
          <WelcomeFeature title="Controllable" description="You control when you want to update" icon="adjustments" href="https://webcrate.app/docs/faq#how-are-updates-handled" />
          <WelcomeFeature title="Transparent" description="View all of your data at any time" icon="eye" href="https://webcrate.app/docs/faq#how-can-i-view-my-data" />
        </div>
      </div>
    </div>
    <div v-if="state === 'name'" class="basics">
      <h1>Your own WebCrate</h1>
      <p>This is your own instance of WebCrate. Give it a name to make it yours!</p>
      <hr>
      <input
        v-model="name"
        v-focus
        v-shortkey="['enter']"
        class="input"
        placeholder="Maxi's WebCrate"
        @shortkey="saveName"
      />
      <div class="info">
        <Icon name="info" />
        <p>You can always change this later</p>
      </div>
      <button v-if="name" class="primary-button" @click="saveName">
        Next Step
      </button>
      <button v-else class="button" @click="saveName">
        Skip this step
      </button>
    </div>
    <div v-if="state === 'crates'" class="basics">
      <h1>The Basics: Crates</h1>
      <p>In WebCrate you organize links of the same topic into folders or groups called crates. Each crate can contain as many links as you want. You can give each crate a name and assign it an emoji as a icon.</p>
      <hr>
      <h2 v-if="crates.length <= 2">
        Default Crates:
      </h2>
      <h2 v-else>
        Your Crates:
      </h2>
      <CrateListItem v-for="crate in crates" :key="crate.id" :icon="crate.icon" :name="crate.name" style="cursor: initial" />
      <hr>
      <CrateListItem icon="heavy_plus_sign" name="Add your own crate" @click.native.stop="showAddCrateModal" />
      <div class="info">
        <Icon name="info" />
        <p>You can also create a new crate later</p>
      </div>
      <button class="primary-button" @click="state = 'links'">
        Next Step
      </button>
    </div>
    <div v-if="state === 'links'" class="basics">
      <h1>The Basics: Links</h1>
      <p>A link is a URL of a website which you add to WebCrate. When you add a new link, we automatically grap the site's title, description and image and display them for you. You can change the title and description at any time to make it easier to know what a link is about.</p>
      <hr>
      <h2>Here's how a link will look like (click it to open the details view):</h2>
      <LinkListItem
        id="AWZVIzS9HSVn7Ylv"
        :title="demoLink.meta.title"
        :url="demoLink.url"
        :icon="demoLink.meta.icon"
        :load-external-icon="true"
        @click.native.stop="openLink(demoLink)"
      />
      <LinkListItem
        v-for="link in links"
        :id="link.id"
        :key="link.id"
        :title="link.meta.title"
        :url="link.url"
        :icon="link.meta && link.meta.icon"
        @click.native.stop="openLink(link)"
      />
      <hr>
      <CrateListItem icon="heavy_plus_sign" name="Add your first link" @click.native.stop="showAddLinkModal" />
      <div class="info">
        <Icon name="info" />
        <p>You can also add a new link later</p>
      </div>
      <button class="primary-button" @click="state = 'end'">
        Next Step
      </button>
    </div>
    <div v-if="state === 'end'" class="basics">
      <h1>All done 🎉</h1>
      <p>That's all of the basics you need to know to use WebCrate! If you want to learn more about all the features WebCrate has to offer, check out the documentation.</p>
      <hr>
      <div class="info">
        <Icon name="info" />
        <p><a href="https://webcrate.app/docs" target="_blank" rel="noopener">View Documentation</a></p>
      </div>
      <button class="primary-button" @click="done">
        Start using WebCrate
      </button>
    </div>
  </div>
</template>

<script>
/*
	TODO: Refresh recent links when a new link is added
*/
export default {
	layout: 'default',
	data() {
		return {
			state: 'load',
			name: undefined,
			demoLink: { id: 'demo', url: 'https://github.com ', crate: undefined, meta: { description: 'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and feat...', icon: 'https://github.githubassets.com/favicons/favicon.svg', image: 'https://github.githubassets.com/images/modules/site/social-cards/github-social.png', title: 'GitHub: Where the world builds software' }, redirect: { enabled: false }, addedWith: 'web', addedAt: '2021-07-19T17:34:25.671Z' }
		}
	},
	async fetch() {
		this.$store.dispatch('GET_CRATES', 5)

		const links = await this.$api.getRecentLinks()
		this.$store.commit('SET_CURRENT_CRATE_LINKS', links)
	},
	head() {
		return {
			title: 'Welcome | WebCrate',
			link: [
				{ rel: 'icon', type: 'image/icon', href: `/favicon.png` }
			]
		}
	},
	computed: {
		showModal() {
			return this.$modal.getShown()
		},
		crates() {
			return (this.$store.state.crates || []).slice(0, 6)
		},
		links() {
			if (!this.$store.state.currentCrateLinks) return []
			return (this.$store.state.currentCrateLinks || []).slice(0, 6)
		}
	},
	mounted() {
		const matched = window.location.hostname.match(/webcrate.(.*).deta.app/)

		if (matched && matched[1]) {
			this.name = `${ matched[1] }'s WebCrate`
		}
	},
	methods: {
		showAddCrateModal() {
			this.$modal.replace('addCrate', { changePageOnSuccess: false })
		},
		showAddLinkModal() {
			this.$modal.replace('addLink')
		},
		openLink(link) {
			this.$modal.replace('linkDetails', { link, editable: false })
		},
		async done() {
			// Set the stored version to the current one to prevent the changelog modal from showing.
			await this.$api.sawConfig()

			this.$router.push(`/`)
		},
		async saveName() {
			let name = this.name
			if (!name) {
				name = 'WebCrate'
			}

			await this.$api.setConfig({ name })
			this.$store.commit('SET_CONFIG', { name })
			this.state = 'crates'
			this.name = name
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

		.logo {
			position: fixed;
			top: 2rem;
			left: 2rem;
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
	}

	.welcome {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 1000px;
		width: 95%;
		margin: auto;

		& button {
			font-size: 1rem;
			padding: 0.7rem 1.3rem;
		}
	}

	.basics {
		max-width: 700px;
		width: 95%;
		margin: auto;
		margin-top: 5rem;
	}

	.welcome {
		text-align: center;

		& h1 {
			font-size: 1.6rem;
			font-weight: 600;
			color: var(--text);
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		& p {
			font-size: 1.1rem;
		}

		& button {
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		.light {
			color: var(--text-light);
			font-size: 0.9rem;
			margin-top: -0.5rem;
		}
	}

	.features {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 3rem;

		& a {
			margin: 0 0.5rem;
			margin-bottom: 1rem;
		}
	}

	@media screen and (max-width: 1100px) {
		.welcome {
			max-width: 1000px;
			width: 95%;
			margin: auto;
			margin-top: 5rem;

			& button {
				font-size: 1rem;
				padding: 0.7rem 1.3rem;
			}
		}
	}

	.basics {
		& h1 {
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--text);
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		& h2 {
			font-size: 1.1rem;
			font-weight: 500;
			color: var(--text);
			margin-top: 1rem;
			margin-bottom: 1rem;
		}

		& hr {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}

		.info {
			color: var(--text-light);
			display: flex;
			align-items: center;
			margin-top: 1rem;

			& p {
				margin-left: 0.5rem;
			}

			& a {
				color: var(--text-light);
			}
		}

		& button {
			margin-top: 1rem;
		}
	}

</style>