<template>
  <Modal
    class="link-details-modal"
    max-width="1000px"
    min-height="250px"
    :can-close="canClose"
    :can-expand="!$fetchState.pending && link !== undefined"
    @close="close"
    @expand="expand"
  >
    <p v-if="$fetchState.pending">
      <LoadingItem />
      <LoadingItem height="25px" />
      <LoadingItem height="100px" />
    </p>
    <div v-else-if="link">
      <div v-if="editable" v-shortkey="['ctrl', 'del']" @shortkey="deleteLink"></div>
      <div v-shortkey="['ctrl', 'alt', 'c']" @shortkey="copyLink"></div>
      <a ref="externalLink" :href="link.url" target="_blank" rel="noopener" :style="{ 'visibility': 'hidden' }"></a>
      <div class="top">
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
        <div v-if="editable">
          <Actions :actions="linkActions" />
        </div>
        <div v-else class="actions">
          <button class="button" title="Open URL in new tab" @click.stop="openExternalLink">
            <Icon name="externalLink" />
          </button>
        </div>
      </div>
      <hr>
      <ImageDisplay v-if="link.meta && link.meta.image" :src="imageUrl" resize="vertical" />
      <LinkEditor v-model="linkDescription" :editable="editable" placeholder="Add some notes …" />
    </div>
    <p v-else>
      Error
    </p>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			canClose: false,
			windowSize: undefined,
			linkTitle: 'Link title',
			linkDescription: 'Link description',
			cleanupPath: true
		}
	},
	async fetch() {
		if (this.linkId.id !== undefined) {
			this.link = this.linkId
			return
		}

		const link = this.endpoint ? await this.$api.getExternalLink(this.linkId, this.endpoint) : await this.$api.getLink(this.linkId)
		this.$store.commit('SET_CURRENT_LINK_DATA', link)

		this.linkTitle = link.meta && link.meta.title
		this.linkDescription = link.meta && link.meta.description
	},
	computed: {
		link: {
			get() {
				return this.$store.state.currentLinkData
			},
			set(value) {
				this.$store.commit('SET_CURRENT_LINK_DATA', value)
			}
		},
		linkId() {
			return this.$store.state.modal.data.link
		},
		editable() {
			return this.$store.state.modal.data.editable !== undefined ? this.$store.state.modal.data.editable : true
		},
		endpoint() {
			return this.$store.state.modal.data.endpoint
		},
		isPublic() {
			// If the link is not editable and no endpoint is specified, assume it is from a public crate
			return !this.editable && !this.endpoint
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
		changeCrateModal() {
			return this.$store.state.modal.show && this.$store.state.modal.show.changeCrate
		},
		linkActions() {
			return [
				{
					id: 'externalLink',
					text: 'Open URL',
					icon: 'externalLink',
					click: this.openExternalLink,
					show: true,
					dropdown: this.windowSize <= 600
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
					id: 'shareLink',
					text: 'Share link',
					icon: 'share',
					click: this.openShareModal,
					show: this.link.public,
					dropdown: true
				},
				{
					id: 'disableSharing',
					text: 'Disable sharing',
					icon: 'eyeOff',
					click: this.makePrivate,
					show: this.link.public,
					dropdown: true
				},
				{
					id: 'enableSharing',
					text: 'Enable sharing',
					icon: 'eye',
					click: this.makePublic,
					show: !this.link.public,
					dropdown: true
				},
				{
					id: 'deleteLink',
					text: 'Delete Link',
					icon: 'delete',
					click: this.deleteLink,
					show: true,
					dropdown: this.windowSize <= 900
				}
			]
		},
		shareLinkModal() {
			return this.$store.state.modal.show && this.$store.state.modal.show.shareLink
		},
		viewImageModal() {
			return this.$store.state.modal.show && this.$store.state.modal.show.viewImage
		}
	},
	watch: {
		// Prevent shareLink modal from closing outer modal
		shareLinkModal(newValue) {
			if (newValue === true) {
				this.canClose = false
			} else {
				setTimeout(() => {
					this.canClose = true
				}, 500)
			}
		},
		viewImageModal(newValue) {
			if (newValue === true) {
				this.canClose = false
			} else {
				setTimeout(() => {
					this.canClose = true
				}, 500)
			}
		},
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
		},
		changeCrateModal(value) {
			if (value === false) {
				this.canClose = true
			}
		}
	},
	created() {
		// Prevent other old click events from closing modal
		setTimeout(() => {
			this.canClose = true
		}, 200)

		const query = Object.assign({}, this.$route.query)
		if (!query.link) {
			query.link = this.linkId.id || this.linkId
			this.$router.push({ query })
		}
	},
	mounted() {
		this.onResize()

		window.addEventListener('resize', this.onResize)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)

		if (this.cleanupPath) {
			const query = Object.assign({}, this.$route.query)
			delete query.link
			this.$router.push({ query })
		}
	},
	methods: {
		changeCrate() {
			this.canClose = false
			this.$modal.show('changeCrate', {
				linkId: this.link.id
			})
		},
		onResize() {
			this.windowSize = window.innerWidth
		},
		close() {
			if (this.canClose) {
				this.$modal.hide()
			}
		},
		expand() {
			this.cleanupPath = false

			this.$switchToPageOrCrate(this.link.id, {
				fullPage: true,
				...(this.endpoint && { external: this.link.crate }),
				isPublic: this.isPublic
			})
			this.$modal.hide()
		},
		async deleteLink() {
			this.canClose = false
			const confirm = await this.$confirm({
				title: `Are you sure you want to delete this link?`,
				confirmText: 'Delete Link',
				danger: true
			})

			if (!confirm) {
				setTimeout(() => {
					this.canClose = true
				}, 500)

				return
			}

			this.$store.dispatch('DELETE_LINK', this.link.id)
			this.$toast.success('Link deleted!')

			this.canClose = true
			this.close()
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
				setTimeout(() => {
					this.canClose = true
				}, 500)

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

			setTimeout(() => {
				this.canClose = true
			}, 500)
		},
		openExternalLink() {
			this.$refs.externalLink.click()
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-details-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 0;
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

		.top {
			display: flex;
			align-items: center;
			margin-bottom: 0.5rem;

			.title {
				flex-grow: 1;
				overflow-x: hidden;
			}

			.actions {
				margin-left: auto;
				display: flex;

				& .button {
					margin-right: 0.5rem;
				}
			}
		}

		.headline {
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--text);
			width: 100%;
		}

		.description {
			font-size: 1rem;
			margin-top: 0.5rem;
			color: var(--text-light);
			width: 100%;

			&:focus {
				color: var(--text);
			}
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

		hr {
			margin-top: 0.5rem;
			margin-bottom: 0.5rem;
		}

		.dropdown-action {
			margin-left: auto;
		}
	}
</style>