<template>
  <div class="crate-wrapper">
    <div class="top-section">
      <div class="title">
        <h1><span class="emoji" @click.stop="showEmojiPicker = !showEmojiPicker">{{ emojiIcon }}</span> <input v-model="crateName" placeholder="Crate Title" class="no-input headline"></h1>
        <input v-model="crateDescription" class="no-input subtext" placeholder="Click to add a description for this Crate" />
        <div v-if="showEmojiPicker" class="emoji-picker">
          <EmojiPicker @selected="selectEmoji" @close="showEmojiPicker = false" />
        </div>
      </div>
      <div class="actions">
        <button class="button add-btn" @click.stop="showAddLinkModal">
          <Icon name="add" />Add Link
        </button>
        <button class="button" @click.stop="showCrateMenu = !showCrateMenu">
          <Icon name="dotsV" />
        </button>
        <div v-if="showCrateMenu" v-click-outside="closeShowMenu" class="crate-menu">
          <button class="button delete-btn" @click.stop="deleteCrate">
            <Icon name="delete" />Delete Crate
          </button>
        </div>
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
import ClickOutside from 'vue-click-outside'
import emojis from '../../server/utils/emojis'

export default {
	directives: {
		ClickOutside
	},
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
			],
			showCrateMenu: false,
			showEmojiPicker: false
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
		},
		crateDescription: {
			set(value) {
				this.crate.description = value
				this.$store.dispatch('CHANGE_CRATE_DESCRIPTION', { crateId: this.crate.id, description: value })
			},
			get() {
				return this.crate.description
			}
		},
		crateName: {
			set(value) {
				this.crate.name = value
				this.$store.dispatch('CHANGE_CRATE_NAME', { crateId: this.crate.id, name: value })
			},
			get() {
				return this.crate.name
			}
		},
		crateIcon: {
			set(value) {
				this.crate.icon = value
				this.$store.dispatch('CHANGE_CRATE_ICON', { crateId: this.crate.id, icon: value })
			},
			get() {
				return this.crate.icon
			}
		}
	},
	methods: {
		showAddLinkModal() {
			this.$modal.show('addLink')
		},
		closeShowMenu() {
			this.showCrateMenu = false
		},
		async deleteCrate() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this Crate?`,
				message: 'This will also permanently delete all links belonging to that Crate.',
				confirmText: 'Delete Crate'
			})

			if (confirm) {
				this.$store.dispatch('DELETE_CRATE', this.crate.id).then(() => {
					this.$store.commit('SET_CURRENT_CRATE', undefined)
					this.$router.push(`/`)
				})
			}
		},
		selectEmoji(key) {
			this.showEmojiPicker = false
			this.crateIcon = key
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

	.crate-menu {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: -4rem;
		background: var(--background-2nd);
		padding: 0.5rem;
		border-radius: var(--border-radius);
		border: 2px solid var(--grey);

		& .delete-btn {
			display: flex;
			align-items: center;

			& div {
				margin-right: 0.5rem;
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