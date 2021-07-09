<template>
  <div class="crate-wrapper">
    <div class="top-section">
      <div class="title">
        <h1>{{ emojiIcon }} <input v-model="crateName" placeholder="Crate Title" class="no-input headline"></h1>
        <input v-model="crateDescription" class="no-input subtext" placeholder="Click to add a description for this Crate" />
      </div>
      <div class="actions">
        <button class="button add-btn" @click.stop="showAddLinkModal">
          <Icon name="add" />Add Link
        </button>
        <button class="button">
          <Icon name="dotsV" />
        </button>
      </div>
    </div>
    <hr>
    <div v-if="links.length > 0" class="links">
      <Grid>
        <LinkItem v-for="link in links" :key="link.id" :link="link" />
      </Grid>
    </div>
    <div v-else class="empty-state">
      <!-- <Icon name="link" class="link-icon" size="40px" /> -->
      <div class="list">
        <div v-for="i in 3" :key="i" class="empty-link">
          <div class="icon-div"></div>
          <div class="text-div"></div>
        </div>
      </div>
      <h2>{{ emptyMessage }}</h2>
      <p>Drag a link into this Crate or add a new one</p>
      <button class="button" @click.stop="showAddLinkModal">
        <Icon name="add" />Add Link
      </button>
    </div>
  </div>
</template>

<script>
import emojis from '../../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, redirect, store, app: { $api } }) {
		const crateId = params.id

		const crate = await $api.getCrate(crateId)

		if (!crate) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', crate.id)

		store.dispatch('GET_LINKS_FOR_CRATE', crate.id)

		return { crate }
	},
	data() {
		return {
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
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		},
		links() {
			return this.$store.state.currentCrateLinks
		},
		emptyMessage() {
			return this.emptyMessages[Math.floor(Math.random() * this.emptyMessages.length)]
		},
		crateDescription: {
			set(value) {
				this.$store.dispatch('CHANGE_CRATE_DESCRIPTION', { crateId: this.crate.id, description: value })
			},
			get() {
				return this.crate.description
			}
		},
		crateName: {
			set(value) {
				this.$store.dispatch('CHANGE_CRATE_NAME', { crateId: this.crate.id, name: value })
			},
			get() {
				return this.crate.name
			}
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
	.crate-wrapper {
		padding: 2rem;
		min-height: 100vh;

		& hr {
			margin-top: 0.5rem;
		}
	}

	.top-section {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.title {
		flex-grow: 1;

		& h1 {
			display: flex;
			align-items: center;
			font-size: 1.3rem;
		}

		.headline {
			font-size: 1.3rem;
			font-weight: 600;
			color: var(--text);
			flex-grow: 1;
			margin-left: 0.5rem;
		}

		.subtext {
			font-size: 0.9rem;
			margin-top: 0.3rem;
			color: var(--text-light);
			width: 100%;
		}
	}

	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;

		& button {
			display: flex;
			align-items: center;
		}
	}

	.add-btn {
		margin-right: 1rem;

		& div {
			margin-right: 0.5rem;
		}
	}

	.links {
		margin-top: 1rem;
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
</style>