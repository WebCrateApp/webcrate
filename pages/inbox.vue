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
    <div class="section">
      <h2>Recently added links</h2>
      <Grid>
        <LinkItem v-for="link in links" :key="link.id" :link="link" />
      </Grid>
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
			newUrl: undefined
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

	@media only screen and (max-width: 1100px) {
		.title input {
			display: none;
		}
	}
</style>