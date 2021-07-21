<template>
  <Modal class="link-details-modal" width="1000px" @close="close">
    <p v-if="$fetchState.pending ">
      Loading link...
    </p>
    <div v-else-if="link">
      <a ref="externalLink" :href="link.url" target="_blank" rel="noopener" :style="{ 'visibility': 'hidden' }"></a>
      <div class="top">
        <div class="title">
          <h1 class="headline">
            {{ link.meta && link.meta.title }}
          </h1>
          <div class="url-wrapper">
            <img v-if="link.meta && link.meta.icon" :src="`/img/${ link.id }?type=icon`">
            <a :href="link.url" target="_blank" rel="noopener">
              {{ link.url }}
            </a>
          </div>
        </div>
        <div class="actions">
          <button class="button" @click.stop="openExternalLink">
            <Icon name="externalLink" />
          </button>
        </div>
      </div>
      <hr>
      <div v-if="link.meta && link.meta.image" class="image-wrapper">
        <div class="image">
          <img :src="`/img/${ link.id }`">
        </div>
      </div>
      <p class="description">
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
			link: undefined,
			canClose: true,
			showShareMenu: false,
			windowSize: undefined
		}
	},
	async fetch() {
		const link = await this.$api.getLink(this.linkId)
		this.link = link
	},
	computed: {
		currentCrate() {
			return this.$store.getters.currentCrate
		},
		linkId() {
			return this.$store.state.modal.data.link
		},
		domain() {
			return new URL(this.link.url).host
		},
		host() {
			return `${ window.location.protocol }//${ window.location.host }`
		}
	},
	created() {
		const query = Object.assign({}, this.$route.query)
		if (!query.link) {
			query.link = this.linkId
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
		copyLink() {
			const link = this.link.url
			if (link) {
				this.$clipboard(link)
			}
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
	}
</style>