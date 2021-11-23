<template>
  <div class="link-wrapper">
    <div v-if="editable" v-shortkey="['ctrl', 'del']" @shortkey="deleteLink"></div>
    <div v-shortkey="['ctrl', 'alt', 'c']" @shortkey="copyLink"></div>
    <a ref="externalLink" :href="link.url" target="_blank" rel="noopener" :style="{ 'visibility': 'hidden' }"></a>
    <a ref="homepageLink" href="https://webcrate.app" target="_blank" rel="noopener" :style="{ 'visibility': 'hidden' }"></a>
    <div v-if="crateId" class="crate-backlink-wrapper">
      <div v-if="$fetchState.pending" class="crate-backlink">
        <LoadingItem width="150px" height="24px" background="var(--background-2nd)" />
      </div>
      <div v-else-if="crate" class="crate-backlink hover-button" @click.stop="openCrate">
        <Icon name="arrowLeft" />
        <span>{{ emojiIcon }}</span>
        <p>
          {{ crate.name }}
        </p>
      </div>
      <div v-else-if="crateId === 'null' && !isPublic" class="crate-backlink hover-button" @click.stop="openCrate">
        <Icon name="arrowLeft" />
        <span>📭</span>
        <p>
          Inbox
        </p>
      </div>
    </div>
    <div class="top-section">
      <div class="title">
        <input
          v-if="editable"
          v-model="linkTitle"
          class="no-input headline"
          placeholder="Click to add a title for this link"
          title="Click to edit title"
        />
        <h1 v-else class="headline">
          {{ link.meta && link.meta.title }}
        </h1>
        <div class="url-wrapper">
          <Img v-if="link.meta && link.meta.icon" :src="iconUrl" />
          <a :href="link.url" target="_blank" rel="noopener">
            {{ link.url }}
          </a>
        </div>
      </div>
      <Actions :actions="linkActions" />
    </div>
    <hr>
    <div class="link-content">
      <ImageDisplay v-if="link.meta && link.meta.image" :src="imageUrl" :default-height="400" />
      <LinkEditor v-model="linkDescription" :editable="editable" placeholder="Add some notes …" />
    </div>
  </div>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, query, redirect, store, app: { $api } }) {
		const isExternal = query.externalCrate !== undefined
		const isPublic = params.pathMatch.includes('public')
		const editable = !isExternal && !isPublic

		let linkId
		if (isPublic) {
			linkId = params.pathMatch.split('public/')[1]
		} else {
			linkId = params.pathMatch
		}

		if (isExternal) {
			const crateId = query.externalCrate

			if (crateId) {
				store.commit('SET_CURRENT_CRATE', crateId)
			}

			// Check if we have the crate stored, if not get query the API
			let crate = store.getters.findCrateById(crateId)
			if (!crate) {
				crate = await $api.getExternalCrate(crateId)

				if (!crate) {
					return redirect('/home')
				}
			}

			// Query the API of the external WebCrate instance for the link
			const link = await $api.getExternalLink(linkId, crate.endpoint)
			if (!link) {
				return redirect(`/crate/external/${ crate.id }`)
			}

			store.commit('SET_CURRENT_LINK_DATA', link)

			return {
				crateId: link.crate,
				crate,
				link,
				isExternal,
				endpoint: crate.endpoint,
				isPublic,
				editable,
				linkTitle: link.meta && link.meta.title,
				linkDescription: link.meta && link.meta.description
			}
		}

		const link = await $api.getLink(linkId)
		if (!link) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_LINK_DATA', link)

		store.commit('SET_CURRENT_PAGE', undefined)
		if (link.crate) {
			store.commit('SET_CURRENT_CRATE', link.crate)
		}

		// Check if we have the crate stored, if not get it later during fetch
		const crate = store.getters.findCrateById(link.crate)

		return {
			crateId: link.crate,
			crate,
			link,
			isExternal,
			isPublic,
			editable,
			linkTitle: link.meta && link.meta.title,
			linkDescription: link.meta && link.meta.description
		}
	},
	data() {
		return {
			windowSize: undefined
		}
	},
	async fetch() {
		if (!this.crateId) return

		if (!this.crate) {
			this.crate = this.isExternal ? await this.$api.getExternalCrate(this.crateId) : await this.$api.getCrate(this.crateId)
		}
	},
	head() {
		return {
			title: `${ this.link.meta && this.link.meta.title ? this.link.meta.title : 'Link' } | WebCrate`,
			link: [
				{ rel: 'icon', type: 'image/svg', href: this.link.meta && this.link.meta.icon }
			]
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		},
		imageUrl() {
			if (this.link.id === 'demo') {
				return this.link.meta.image
			} else if (this.endpoint) {
				return `https://${ this.endpoint }/img/${ this.link.id }`
			} else {
				return `/img/${ this.link.id }`
			}
		},
		iconUrl() {
			if (this.link.id === 'demo') {
				return this.link.meta.icon
			} else if (this.endpoint) {
				return `https://${ this.endpoint }/img/${ this.link.id }?type=icon`
			} else {
				return `/img/${ this.link.id }?type=icon`
			}
		},
		domain() {
			try {
				return new URL(this.link.url).host
			} catch (err) {
				return undefined
			}
		},
		linkActions() {
			return [
				{
					id: 'externalLink',
					text: 'Open URL',
					icon: 'externalLink',
					click: this.openExternalLink,
					show: true,
					dropdown: this.windowSize <= 550
				},
				{
					id: 'copyLink',
					text: 'Copy URL',
					icon: 'clipboard',
					click: this.copyLink,
					show: true,
					dropdown: true
				},
				{
					id: 'changeCrate',
					text: 'Move Link',
					icon: 'folderOpen',
					click: this.changeCrate,
					show: this.editable,
					dropdown: true
				},
				{
					id: 'info',
					text: 'What\'s WebCrate?',
					icon: 'info',
					click: this.openHomepageLink,
					show: this.isPublic,
					dropdown: this.windowSize <= 600
				},
				{
					id: 'shareLink',
					text: 'Share link',
					icon: 'share',
					click: this.openShareModal,
					show: this.editable && this.link.public,
					dropdown: true
				},
				{
					id: 'disableSharing',
					text: 'Disable sharing',
					icon: 'eyeOff',
					click: this.makePrivate,
					show: this.editable && this.link.public,
					dropdown: true
				},
				{
					id: 'enableSharing',
					text: 'Enable sharing',
					icon: 'eye',
					click: this.makePublic,
					show: this.editable && !this.link.public,
					dropdown: true
				},
				{
					id: 'deleteLink',
					text: 'Delete Link',
					icon: 'delete',
					click: this.deleteLink,
					show: this.editable,
					dropdown: this.windowSize <= 900
				}
			]
		}
	},
	watch: {
		linkTitle(value, oldValue) {
			if (!value || value === oldValue || !this.editable) return

			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					'meta.title': value
				}
			})
		},
		linkDescription(value, oldValue) {
			if (!value || value === oldValue || !this.editable) return

			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					'meta.description': value
				}
			})
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
		onResize() {
			this.windowSize = window.innerWidth
		},
		openCrate() {
			this.$switchToPageOrCrate(this.crateId, { external: this.isExternal, isPublic: this.isPublic })
		},
		changeCrate() {
			this.$modal.show('changeCrate', {
				linkId: this.link.id
			})
		},
		async deleteLink() {
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this link?`,
				confirmText: 'Delete Link',
				danger: true
			})

			if (!confirm) {
				return
			}

			this.$store.dispatch('DELETE_LINK', this.link.id)
			this.$toast.success('Link deleted!')

			this.$router.push('/')
		},
		copyLink() {
			const link = this.link.url
			if (link) {
				this.$clipboard(link)
				this.$toast.success('URL copied to clipboard!')
			}
		},
		openShareModal() {
			this.$modal.show('shareLink', { link: this.link })
		},
		makePublic() {
			this.link = {
				...this.link,
				public: true
			}
			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					public: true
				}
			})

			this.$toast.success('Link sharing enabled!')

			this.openShareModal()
		},
		async makePrivate() {
			this.canClose = false
			const confirm = await this.$confirm({
				title: `Are you sure you want to make this link private?`,
				message: 'The sharing link will stop working and a 404 error will be shown instead.',
				confirmText: 'Make private',
				danger: true
			})

			if (!confirm) {
				return
			}

			this.link = {
				...this.link,
				public: false
			}

			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					public: false
				}
			})

			this.$toast.success('Link sharing disabled!')
		},
		openExternalLink() {
			this.$refs.externalLink.click()
		},
		openHomepageLink() {
			this.$refs.homepageLink.click()
		}
	}
}

</script>

<style lang="scss" scoped>
	.link-wrapper {
		padding: 2rem;
		min-height: 100vh;

		& hr {
			margin-top: 0.5rem;
		}

		& a {
			color: var(--text-light);
			margin-top: 0rem;
			text-decoration: none;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	@media only screen and (max-width: 900px) {
		.link-wrapper {
			padding: 1.5rem;
		}
	}

	.crate-backlink-wrapper {
		display: flex;
	}

	.crate-backlink {
		display: flex;
		align-items: center;
		flex-grow: 0;
		margin-bottom: 0rem;

		& p {
			margin-left: 0.5rem;
		}

		& div {
			margin-right: 0.5rem;
			color: var(--text-light);
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
		overflow-x: hidden;

		.headline {
			display: flex;
			align-items: center;
			width: 100%;
			font-size: 1.2rem;
			font-weight: 600;
			color: var(--text);
		}

		.url-wrapper {
			display: flex;
			align-items: center;

			& img {
				width: 17px;
				height: 17px;
				margin-right: 0.3rem;
			}
		}
	}

	@media only screen and (max-width: 900px) {
		.title {
			.headline {
				font-size: 1.1rem;
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

	.link-content {
		padding-top: 1rem;
	}
</style>