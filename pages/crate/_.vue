<template>
  <div class="crate-wrapper">
    <div v-shortkey="['ctrl', 'a']" @shortkey="showAddLinkModal"></div>
    <div class="top-section">
      <div v-if="editable" class="title">
        <h1><span class="emoji" title="Click to edit icon" @click.stop="showEmojiPicker = !showEmojiPicker">{{ emojiIcon }}</span> <input v-model="crateName" title="Click to edit title" placeholder="Crate Title" class="no-input headline"></h1>
        <input v-model="crateDescription" title="Click to edit description" class="no-input subtext" placeholder="Click to add a description for this Crate" />
        <div v-if="showEmojiPicker" class="emoji-picker">
          <EmojiPicker @selected="selectEmoji" @close="showEmojiPicker = false" />
        </div>
      </div>
      <div v-else class="title">
        <h1>
          <span>{{ emojiIcon }}</span>
          <span class="headline">{{ crate.name }}<span v-if="isExternal" class="endpoint"> @{{ crate.endpoint }}</span></span>
        </h1>
        <p class="subtext">
          {{ crate.description }}
        </p>
      </div>
      <div v-if="editable" class="actions">
        <button class="button add-btn" @click.stop="showAddLinkModal">
          <Icon name="add" />Add Link
        </button>
        <button v-if="crate.public" class="button share-btn" @click.stop="showShareModal">
          <Icon name="share" />
        </button>
        <ActionDropdown class="dropdown-action" icon="dotsV" :actions="crateActions" />
      </div>
      <div v-else-if="isPublic" class="actions">
        <button class="button add-btn" @click.stop="showAddModal">
          <Icon name="heart" />Save this Crate
        </button>
      </div>
      <div v-else-if="isExternal" class="actions">
        <button class="button share-btn" @click.stop="showShareModal">
          <Icon name="share" />
        </button>
        <button class="button delete-btn" @click.stop="deleteExternal">
          <Icon name="delete" />
        </button>
      </div>
    </div>
    <hr>
    <div v-if="$fetchState.pending" class="links">
      <Grid>
        <LinkLoadingItem v-for="idx in 6" :key="'i' + idx" />
      </Grid>
    </div>
    <div v-else-if="links.length > 0" class="links">
      <Grid>
        <LinkItem
          v-for="link in links"
          :key="link.id"
          :link="link"
          :editable="editable"
          :draggable="!isPublic"
          :endpoint="crate.endpoint"
        />
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
      <div v-if="editable">
        <p>Drag a link into this crate or add a new one</p>
        <button class="button" @click.stop="showAddLinkModal">
          <Icon name="add" />Add Link
        </button>
      </div>
      <div v-else-if="isPublic">
        <p>Poke the creator to add some links or <a href="https://webcrate.app/docs" target="_blank" rel="noopener">create your own crate</a></p>
      </div>
      <div v-else-if="isExternal">
        <p>Poke the creator to add some links</p>
      </div>
    </div>
  </div>
</template>

<script>
import emojis from '../../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, redirect, store, app: { $api, $modal }, query }) {
		const isExternal = params.pathMatch.includes('external')
		const isPublic = params.pathMatch.includes('public')
		const editable = !isExternal && !isPublic

		const config = await $api.getConfig()
		store.commit('SET_CONFIG', config)

		let crateId
		if (isExternal) {
			crateId = params.pathMatch.split('external/')[1]
		} else if (isPublic) {
			crateId = params.pathMatch.split('public/')[1]
		} else {
			crateId = params.pathMatch
		}

		const crate = isExternal ? await $api.getExternalCrate(crateId) : await $api.getCrate(crateId)

		if (!crate) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', crate.id)

		const link = query.link
		if (link) {
			$modal.show('linkDetails', { link })
		}

		return { crate, isExternal, isPublic, editable }
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
	async fetch() {
		this.$store.commit('SET_CURRENT_CRATE_LINKS', undefined)

		const links = this.isExternal ? await this.$api.getLinksOfExternalCrate(this.crate) : await this.$api.getLinksOfCrate(this.crate.id)
		this.$store.commit('SET_CURRENT_CRATE_LINKS', links)
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
		},
		crateActions() {
			const items = []

			if (this.crate.public) {
				items.push({
					text: 'Make Private',
					icon: 'eyeOff',
					click: this.makePrivate
				})
			} else {
				items.push({
					text: 'Make Public',
					icon: 'eye',
					click: this.makePublic
				})
			}

			items.push({
				text: 'Delete Crate',
				icon: 'delete',
				click: this.deleteCrate
			})

			return items
		}
	},
	methods: {
		showAddLinkModal() {
			this.$modal.show('addLink')
		},
		showShareModal() {
			const endpoint = this.isExternal ? `https://${ this.crate.endpoint }` : `${ location.protocol }//${ location.host }`

			this.$modal.show('copyOutput', {
				inputValue: `${ endpoint }/crate/public/${ this.crate.id }`,
				title: `Share "${ this.emojiIcon } ${ this.crate.name }"`,
				message: `Copy the URL below to share this crate with anyone!`
			})
		},
		showAddModal() {
			this.$modal.show('copyOutput', {
				inputValue: `${ location.protocol }//${ location.host }/crate/public/${ this.crate.id }`,
				title: `Add this crate to your own WebCrate instance`,
				message: `Go to your own WebCrate instance and paste this URL in the "add external crate" field`
			})
		},
		async deleteCrate() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this crate?`,
				message: 'This will also permanently delete all links belonging to that crate.',
				confirmText: 'Delete Crate',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('DELETE_CRATE', this.crate.id).then(() => {
					this.$store.commit('SET_CURRENT_CRATE', undefined)
					this.$router.push(`/`)
				})
			}
		},
		async deleteExternal() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to remove this external crate?`,
				message: 'You can always readd it later.',
				confirmText: 'Remove Crate',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('DELETE_EXTERNAL_CRATE', this.crate.id).then(() => {
					this.$store.commit('SET_CURRENT_CRATE', undefined)
					this.$router.push(`/`)
				})
			}
		},
		makePublic() {
			this.$store.dispatch('CHANGE_CRATE_ACCESS', { crateId: this.crate.id, isPublic: true }).then(() => {
				this.crate.public = true
				this.showShareModal()
			})
		},
		async makePrivate() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to make this crate private?`,
				message: 'If you have already shared this crate, users will see a 404 error.',
				confirmText: 'Make Private',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('CHANGE_CRATE_ACCESS', { crateId: this.crate.id, isPublic: false }).then(() => {
					this.crate.public = false
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

		.endpoint {
			color: var(--text-light);
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

		.dropdown-action {
			margin-left: auto;
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

	.emoji-picker {
		position: absolute;
		z-index: 10;
		left: 0;
		top: 2rem;
	}
</style>