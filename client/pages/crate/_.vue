<template>
  <div class="crate-wrapper">
    <div v-shortkey="['ctrl', 'a']" @shortkey="showAddLinkModal"></div>
    <a ref="homepageLink" href="https://webcrate.app" target="_blank" rel="noopener" :style="{ 'visibility': 'hidden' }"></a>
    <div class="top-section">
      <div v-if="editable" class="title">
        <div class="headline">
          <span class="emoji" title="Click to edit icon" @click.stop="showEmojiPicker = !showEmojiPicker">{{ emojiIcon }}</span>
          <input v-model="crateName" class="no-input" placeholder="Crate Title" title="Click to edit title" />
          <!-- <EditableText v-model="crateName" elem="h1" placeholder="Crate Title" title="Click to edit title" /> -->
        </div>
        <input v-model="crateDescription" class="no-input subtext" placeholder="Click to add a description for this Crate" title="Click to edit description" />
        <!-- <EditableText v-model="crateDescription" class="subtext" placeholder="Click to add a description for this Crate" title="Click to edit description" /> -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <EmojiPicker @selected="selectEmoji" @close="showEmojiPicker = false" />
        </div>
      </div>
      <div v-else class="title">
        <div class="headline">
          <span>{{ emojiIcon }}</span>
          <h1>{{ crate.name }}</h1>
          <p v-if="(isExternal || isPublic) && windowSize >= 600" class="endpoint">
            @{{ endpoint }}
          </p>
        </div>
        <p v-if="(isExternal || isPublic) && windowSize < 600" class="endpoint">
          @{{ endpoint }}
        </p>
        <p class="subtext">
          {{ crate.description }}
        </p>
      </div>
      <Actions :actions="actions" />
    </div>
    <hr>
    <div v-if="deleted" class="empty-state">
      <Icon name="error" size="50px" class="deleted" />
      <h2>Crate unavailable</h2>
      <p>This external crate was either deleted or set to private by its original owner. <br>You can remove it now or keep it in the case that it's set back to public.</p>
      <button class="button" @click.stop="deleteExternal">
        <Icon name="delete" />Delete now
      </button>
    </div>
    <div v-else-if="$fetchState.pending" class="links">
      <Grid>
        <LinkLoadingItem v-for="idx in 6" :key="'i' + idx" />
      </Grid>
    </div>
    <div v-else-if="links.length > 0" class="links">
      <GridStack v-if="links && links.length" ref="linkGrid" :column-min-width="350" :monitor-images-loaded="true">
        <LinkItem
          v-for="link in links"
          :key="link.id"
          :link="link"
          :editable="editable"
          :draggable="!isPublic"
          :endpoint="crate.endpoint"
          :show-image="showImages"
          @imageLoaded="reflowGrid"
        />
      </GridStack>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
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
import emojis from '@/../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, redirect, store, app: { $api, $modal, $storage }, query }) {
		const isExternal = params.pathMatch.includes('external')
		const isPublic = params.pathMatch.includes('public')
		const editable = !isExternal && !isPublic

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

		store.commit('SET_CURRENT_PAGE', undefined)
		store.commit('SET_CURRENT_CRATE', crate.id)

		// If showImages is not set, use the user's global setting as a fallback
		if (crate.showImages === undefined) {
			const stored = $storage.get($storage.types.SHOW_IMAGES_IN_LIST, true)
			crate.showImages = stored || false
		}

		const link = query.link
		if (link) {
			$modal.replace('linkDetails', { link, endpoint: crate.endpoint, editable })
		}

		return { crate, isExternal, isPublic, editable, deleted: crate.deleted }
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
			showEmojiPicker: false,
			lastLink: undefined,
			windowSize: undefined,
			editDescription: false
		}
	},
	async fetch() {
		this.$store.commit('SET_CURRENT_CRATE_LINKS', [])

		if (this.deleted) return

		const res = this.isExternal ? await this.$api.getLinksOfExternalCrate(this.crate) : await this.$api.getLinksOfCrate(this.crate.id)

		if (res.last) {
			this.lastLink = res.last
		}

		this.$store.commit('SET_CURRENT_CRATE_LINKS', res.data)
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
		endpoint() {
			return this.isExternal ? this.crate.endpoint : location.hostname
		},
		currentCrate() {
			return this.$store.getters.currentCrate
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
				this.$toast.success('Icon changed!')
			},
			get() {
				return this.crate.icon
			}
		},
		showImages: {
			// Prefers crate's setting and falls back to user's global setting (stored in browser)
			get() {
				if (this.crate.showImages !== undefined) {
					return this.crate.showImages
				}

				return this.$storage.get(this.$storage.types.SHOW_IMAGES_IN_LIST, true) || false
			},
			// If crate is editable it will call the API else it will change the users's global setting
			set(value) {
				if (this.editable) {
					this.$store.dispatch('CHANGE_CRATE', { crateId: this.crate.id, changes: { showImages: value } })
				} else {
					this.$storage.set(this.$storage.types.SHOW_IMAGES_IN_LIST, value)
				}

				this.crate.showImages = value
			}
		},
		actions() {
			return [
				{
					id: 'addLink',
					text: 'Add Link',
					icon: 'add',
					click: this.showAddLinkModal,
					show: this.editable,
					showText: this.windowSize >= 600,
					dropdown: this.windowSize <= 450
				},
				{
					id: 'shareCrate',
					text: 'Share Crate',
					icon: 'share',
					click: this.showShareModal,
					show: this.editable ? this.crate.public : this.isExternal,
					dropdown: this.editable ? this.windowSize <= 900 : this.windowSize <= 600
				},
				{
					id: 'saveCrate',
					text: 'Save this Crate',
					icon: 'heart',
					click: this.showAddModal,
					show: this.isPublic,
					showText: this.windowSize >= 750,
					dropdown: this.windowSize <= 550
				},
				{
					id: 'info',
					text: 'What\'s WebCrate?',
					icon: 'info',
					click: this.openHomepageLink,
					show: this.isPublic,
					dropdown: true
				},
				{
					id: 'changeView',
					text: 'Show images',
					icon: 'image',
					click: this.changeGridView,
					show: !this.showImages,
					dropdown: true
				},
				{
					id: 'changeView',
					text: 'Hide images',
					icon: 'image',
					click: this.changeGridView,
					show: this.showImages,
					dropdown: true
				},
				{
					id: 'makePrivate',
					text: 'Make Private',
					icon: 'eyeOff',
					click: this.makePrivate,
					show: this.editable && this.crate.public,
					dropdown: true
				},
				{
					id: 'makePublic',
					text: 'Make Public',
					icon: 'eye',
					click: this.makePublic,
					show: this.editable && !this.crate.public,
					dropdown: true
				},
				{
					id: 'deleteCrate',
					text: 'Delete Crate',
					icon: 'delete',
					click: this.isExternal ? this.deleteExternal : this.deleteCrate,
					show: this.editable || this.isExternal,
					dropdown: true
				}
			]
		},
		numLinks() {
			return this.links.length
		}
	},
	watch: {
		currentCrate(newCrate, oldCrate) {
			// Only continue if the same crate has changed
			if (!newCrate || !oldCrate || newCrate.id !== oldCrate.id) {
				return
			}

			if (oldCrate.name !== newCrate.name) {
				this.$toast.success('Name changed!')
			}

			if (oldCrate.description !== newCrate.description) {
				this.$toast.success('Description changed!')
			}
		},
		// Try to catch edge case where links are added/removed but the grid doesn't detect it
		numLinks(newValue, oldValue) {
			if (newValue && newValue !== oldValue && this.$refs.linkGrid) {
				this.reflowGrid()
			}
		}
	},
	mounted() {
		this.onResize()
		window.addEventListener('resize', this.onResize)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		reflowGrid() {
			this.$refs.linkGrid.update()
		},
		onResize() {
			this.windowSize = window.innerWidth
		},
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
				message: `This will also permanently delete all links belonging to that crate.${ this.crate.public ? ' All users who are subscribed to this crate or try to access it by its link will see an error.' : '' }`,
				confirmText: 'Delete Crate',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('DELETE_CRATE', this.crate.id).then(() => {
					this.$store.commit('SET_CURRENT_CRATE', undefined)
					this.$router.push(`/`)

					this.$toast.success('Crate deleted!')
				})
			}
		},
		async deleteExternal() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to remove this external crate?`,
				...(!this.deleted && { message: 'You can always re-add with its original sharing link later.' }),
				confirmText: 'Remove Crate',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('DELETE_EXTERNAL_CRATE', this.crate.id).then(() => {
					this.$store.commit('SET_CURRENT_CRATE', undefined)
					this.$router.push(`/`)

					this.$toast.success('External crate removed!')
				})
			}
		},
		makePublic() {
			this.$store.dispatch('CHANGE_CRATE_ACCESS', { crateId: this.crate.id, isPublic: true }).then(() => {
				this.crate.public = true
				this.showShareModal()

				this.$toast.success('Crate set to public!')
			})
		},
		async makePrivate() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to make this crate private?`,
				message: 'All users who are subscribed to this crate or try to access it by its link will see an error.',
				confirmText: 'Make Private',
				danger: true
			})

			if (confirm) {
				this.$store.dispatch('CHANGE_CRATE_ACCESS', { crateId: this.crate.id, isPublic: false }).then(() => {
					this.crate.public = false

					this.$toast.success('Crate set to private!')
				})
			}
		},
		changeGridView() {
			this.showImages = !this.showImages
		},
		selectEmoji(key) {
			this.showEmojiPicker = false
			this.crateIcon = key
		},
		async infiniteHandler($state) {
			if (!this.lastLink) return $state.complete()

			const res = this.isExternal ? await this.$api.getLinksOfExternalCrate(this.crate, 20, this.lastLink) : await this.$api.getLinksOfCrate(this.crate.id, 20, this.lastLink)

			if (res.data && res.data.length > 0) {
				this.$store.commit('ADD_CURRENT_CRATE_LINKS', res.data)
			}

			if (res.last) {
				this.lastLink = res.last
				$state.loaded()
			} else {
				$state.complete()
			}
		},
		openHomepageLink() {
			this.$refs.homepageLink.click()
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

	@media only screen and (max-width: 900px) {
		.crate-wrapper {
			padding: 1.5rem;
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
		margin-right: 0.5rem;

		.endpoint {
			color: var(--text-light);
			font-size: 1rem;
			margin-top: 0.2rem;
			margin-bottom: 0.5rem;
		}

		.headline {
			display: flex;
			align-items: center;
			font-size: 1.3rem;
			flex-grow: 1;

			.emoji {
				cursor: pointer;
			}

			h1, input {
				font-size: inherit;
				font-weight: 600;
				color: var(--text);
				margin-left: 0.5rem;
			}

			.endpoint {
				font-size: 1.2rem;
				margin: 0;
				margin-left: 0.5rem;
			}
		}

		.subtext {
			font-size: 1rem;
			color: var(--text-light);
			width: 100%;
			margin-top: 0.2rem;

			&:focus {
				color: var(--text);
			}
		}
	}

	@media only screen and (max-width: 900px) {
		.title {
			.subtext {
				font-size: 0.9rem;
			}

			.headline {
				font-size: 1.1rem;

				.endpoint {
					font-size: 1rem;
				}
			}
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
		text-align: center;

		.deleted {
			color: var(--red);
		}

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