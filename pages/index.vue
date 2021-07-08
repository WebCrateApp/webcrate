<template>
  <div class="page-wrapper">
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
        <CrateItem v-for="crate in crates" :key="crate.key" :crate="crate" />
      </Grid>
    </div>
    <div class="section">
      <h2>Recently added links</h2>
      <Grid>
        <LinkItem v-for="link in links" :key="link.key" :link="link" />
      </Grid>
    </div>
  </div>
</template>

<script>
export default {
	layout: 'sidebar',
	async asyncData({ app: { $api } }) {
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
	computed: {
		welcomeMessage() {
			return this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)]
		}
	},
	methods: {
		showAddLinkModal() {
			this.$store.commit('SET_SHOW_MODAL', { modal: 'addLink', value: true })
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