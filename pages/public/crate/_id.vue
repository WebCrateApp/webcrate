<template>
  <div class="crate-wrapper">
    <div class="top-section">
      <div class="title">
        <h1>
          <span class="emoji" @click.stop="showEmojiPicker = !showEmojiPicker">{{ emojiIcon }}</span>
          <span class="headline">{{ crate.name }}</span>
        </h1>
        <p class="subtext">
          {{ crate.description }}
        </p>
      </div>
      <div class="actions">
        <button class="button add-btn" @click.stop="showAddModal">
          <Icon name="heart" />Save this Crate
        </button>
      </div>
    </div>
    <hr>
    <div v-if="links.length > 0" class="links">
      <Grid>
        <LinkItemPublic v-for="link in links" :key="link.id" :link="link" />
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
      <p>Poke the creator to add some links or <a href="https://webcrate.deta.dev/docs" target="_blank" rel="noopener">create your own crate</a></p>
    </div>
  </div>
</template>

<script>
import emojis from '@/server/utils/emojis'

export default {
	layout: 'sidebarPublic',
	async asyncData({ params, redirect, store, app: { $api, $modal }, query }) {
		const crateId = params.id

		const crate = await $api.getCrate(crateId)

		if (!crate) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', crate.id)

		store.dispatch('GET_LINKS_FOR_CRATE', crate.id)

		const link = query.link

		if (link) {
			$modal.show('linkDetails', { link })
		}

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
			],
			showEmojiPicker: false
		}
	},
	head() {
		return {
			title: `${ this.crate.name || 'Crate' } | WebCrate`,
			link: [
				{ rel: 'icon', type: 'image/svg', href: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${ this.emojiIcon }</text></svg>` }
			]
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		},
		links: {
			set(value) {
				this.$store.commit('SET_CURRENT_CRATE_LINKS', value)
			},
			get() {
				return this.$store.state.currentCrateLinks
			}
		},
		emptyMessage() {
			return this.emptyMessages[Math.floor(Math.random() * this.emptyMessages.length)]
		}
	},
	methods: {
		showAddModal() {
			this.$modal.show('copyOutput', {
				inputValue: `${ location.protocol }//${ location.host }/public/crate/${ this.crate.id }`,
				title: `Add this crate to your own WebCrate`,
				message: `Go to your own WebCrate and paste this URL in the "add external crate" field`
			})
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
		position: relative;

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

			&:focus {
				color: var(--text);
			}
		}

		.emoji {
			cursor: pointer;
		}
	}

	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		position: relative;

		& button {
			display: flex;
			align-items: center;
		}
	}

	.add-btn {
		margin-right: 0.5rem;

		& div {
			margin-right: 0.5rem;
		}
	}

	.share-btn {
		margin-right: 0.5rem;
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

	.emoji-picker {
		position: absolute;
		z-index: 10;
		left: 0;
		top: 2rem;
	}
</style>