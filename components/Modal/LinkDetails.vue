<template>
  <Modal class="link-details-modal" width="1000px" @close="close">
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
          <h1 v-if="editable">
            <input v-model="linkTitle" title="Click to edit title" class="no-input headline" placeholder="Click to add a title for this link" />
          </h1>
          <h1 v-else class="headline">
            {{ link.meta && link.meta.title }}
          </h1>
          <div class="url-wrapper">
            <img v-if="link.meta && link.meta.icon" :src="iconUrl">
            <a :href="link.url" target="_blank" rel="noopener">
              {{ link.url }}
            </a>
          </div>
        </div>
        <div v-if="editable">
          <div v-if="windowSize <= 600" class="actions">
            <ActionDropdown class="dropdown-action" title="More Actions" icon="dotsV" :actions="shareActions" />
          </div>
          <div v-else-if="windowSize <= 900" class="actions">
            <button class="button" title="Open URL in new tab" @click.stop="openExternalLink">
              <Icon name="externalLink" />
            </button>
            <ActionDropdown class="dropdown-action" title="More Actions" icon="dotsV" :actions="shareActions" />
          </div>
          <div v-else class="actions">
            <button class="button" title="Open URL in new tab" @click.stop="openExternalLink">
              <Icon name="externalLink" />
            </button>
            <button class="button" title="Delete this link" @click.stop="deleteLink">
              <Icon name="delete" />
            </button>
            <ActionDropdown class="dropdown-action" title="More Actions" icon="dotsV" :actions="shareActions" />
          </div>
        </div>
        <div v-else class="actions">
          <button class="button" title="Open URL in new tab" @click.stop="openExternalLink">
            <Icon name="externalLink" />
          </button>
        </div>
      </div>
      <hr>
      <div v-if="link.meta && link.meta.image" class="image-wrapper">
        <div class="image">
          <img :src="imageUrl">
        </div>
      </div>
      <textarea-autosize v-if="editable" v-model="linkDescription" :title="editable && 'Click to edit description'" class="no-input description" placeholder="Click to add a description for this link" />
      <p v-else class="description">
        {{ link.meta && link.meta.description }}
      </p>
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
			windowSize: undefined
		}
	},
	async fetch() {
		if (this.linkId.id !== undefined) {
			this.link = this.linkId
			return
		}

		const link = this.endpoint ? await this.$api.getExternalLink(this.linkId, this.endpoint) : await this.$api.getLink(this.linkId)
		this.$store.commit('SET_CURRENT_LINK_DATA', link)
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
		shareActions() {
			const items = [
				{
					text: 'Copy link URL',
					icon: 'clipboard',
					click: this.copyLink
				}
			]

			if (this.link.redirect && this.link.redirect.enabled) {
				items.push({
					text: 'Share this link',
					icon: 'share',
					click: this.openShareModal
				})
				items.push({
					text: 'Disable sharing',
					icon: 'eyeOff',
					click: this.disableRedirect
				})
			} else {
				items.push({
					text: 'Enable sharing',
					icon: 'eye',
					click: this.enableRedirect
				})
			}

			if (this.windowSize <= 600) {
				items.push({
					text: 'Open link',
					icon: 'externalLink',
					click: this.openExternalLink
				})
			}

			if (this.windowSize <= 900) {
				items.push({
					text: 'Delete link',
					icon: 'delete',
					click: this.deleteLink
				})
			}

			return items
		},
		linkDescription: {
			set(value) {
				if (!value || value === this.linkDescription) return

				this.link = {
					...this.link,
					meta: { ...this.link.meta, description: value }
				}

				this.$store.dispatch('CHANGE_LINK', {
					linkId: this.link.id,
					changes: {
						'meta.description': value
					}
				})
			},
			get() {
				return this.link && this.link.meta && this.link.meta.description ? this.link.meta.description : undefined
			}
		},
		linkTitle: {
			set(value) {
				if (!value || value === this.linkTitle) return

				this.link = {
					...this.link,
					meta: { ...this.link.meta, title: value }
				}

				this.$store.dispatch('CHANGE_LINK', {
					linkId: this.link.id,
					changes: {
						'meta.title': value
					}
				})
			},
			get() {
				return this.link && this.link.meta && this.link.meta.title ? this.link.meta.title : undefined
			}
		},
		shareLinkModal() {
			return this.$store.state.modal.show && this.$store.state.modal.show.shareLink
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
		const onResize = () => {
			this.windowSize = window.innerWidth
		}

		onResize()

		window.onresize = onResize
	},
	beforeDestroy() {
		const query = Object.assign({}, this.$route.query)
		delete query.link
		this.$router.push({ query })
	},
	methods: {
		close() {
			if (this.canClose) {
				this.$modal.hide()
			}
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
		enableRedirect() {
			this.link = {
				...this.link,
				redirect: { enabled: true }
			}
			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					'redirect.enabled': true
				}
			})

			this.$toast.success('Link sharing enabled!')

			this.openShareModal()
		},
		async disableRedirect() {
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
				redirect: { enabled: false, shortCode: null }
			}

			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					'redirect.enabled': false,
					'redirect.shortCode': ''
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

			&:hover {
				text-decoration: underline;
			}
		}

		.image-wrapper {
			margin-top: 1rem;
			margin-bottom: 1rem;
			background: var(--background-2nd);
			overflow: hidden;
			border-radius: var(--border-radius);
			resize: vertical;
		}

		.image {
			max-width: 100%;
			max-height: 300px;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;

			& img {
				width: 100%;
				height: 100%;
				pointer-events: none;
			}
		}

		.top {
			display: flex;
			align-items: center;
			margin-bottom: 0.5rem;

			.title {
				flex-grow: 1;
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
			font-size: inherit;
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

		.redirect {
			display: flex;
			align-items: center;
			margin-bottom: 0.5rem;
			background: var(--background-2nd);
			padding: 0.5rem;
			border-radius: var(--border-radius);
			color: var(--text-light);

			& p {
				margin-left: 0.5rem;
			}

			& input {
				font-size: 1rem;
				color: var(--text-light);
				flex-grow: 1;

				&:focus {
					color: var(--text);
				}
			}

			& .copy-short{
				margin-left: auto;
				margin-right: 0.5rem;
				cursor: pointer;
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