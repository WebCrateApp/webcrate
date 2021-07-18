<template>
  <div v-shortkey="['ctrl', 'alt', 'a']" class="page-wrapper" @shortkey="showAddLinkModal">
    <div class="title">
      <h1>{{ welcomeMessage }}</h1>
      <button class="button add-btn" @click.stop="showAddLinkModal">
        <Icon name="add" />Add Link
      </button>
    </div>
    <hr>
    <div class="section">
      <h2>Recently used Crates</h2>
      <Grid max-width="300px">
        <CrateItem v-for="crate in crates" :key="crate.id" :crate="crate" />
      </Grid>
    </div>
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

		const links = await $api.getRecentLinks()
		const crates = await $api.getRecentCrates()

		return { links, crates }
	},
	data() {
		return {
			welcomeMessages: [
				'Welcome back!',
				'Good day!',
				'How\'s it going?',
				'What up?',
				'Great to see you!'
			]
		}
	},
	head() {
		return {
			title: 'Home | WebCrate',
			link: [
				{ rel: 'icon', type: 'image/icon', href: `/favicon.ico` }
			]
		}
	},
	computed: {
		welcomeMessage() {
			return this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)]
		}
	},
	methods: {
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
			flex-grow: 1;
			color: var(--text);
		}

		& button {
			margin-left: auto;
			display: flex;
			align-items: center;
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

</style>