<template>
  <div class="page-wrapper">
    <div v-shortkey="['ctrl', 'a']" @shortkey="showAddLinkModal"></div>
    <div class="title">
      <h1>Inbox</h1>
      <input v-model="newUrl" v-shortkey="['enter']" class="input" placeholder="Quick add a URL" @shortkey="addLink">
      <button class="button add-btn" @click.stop="addLink">
        <Icon name="add" />Add Link
      </button>
    </div>
    <hr>
    <div v-if="links.length > 0" class="section">
      <h2>Recently added links</h2>
      <Grid>
        <LinkItem v-for="link in links" :key="link.id" :link="link" />
      </Grid>
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
	async asyncData({ app: { $api, $modal }, query }) {
		const addUrl = query.addUrl
		const link = query.link

		if (addUrl) {
			$modal.show('addLink', { inputValue: addUrl })
		} else if (link) {
			$modal.show('linkDetails', { link })
		}

		const links = await $api.getRecentLinks(20)

		return { links }
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
			]
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
				this.links.unshift(link)
				this.$modal.show('linkDetails', { link: link.id })
			}).catch((err) => {
				console.log(err)
			})
		},
		showAddLinkModal() {
			this.$modal.show('addLink')
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