<template>
  <Modal class="add-modal" @close="close">
    <h1>Share this link publicly</h1>
    <p>A public link can be accessed by anyone who uses the sharing URL below. They will be able to see the link URL and your notes.</p>
    <div class="link">
      <p>{{ fullShortLink }}</p>
      <Icon :name="copyIcon" @click.native.stop="copy" />
    </div>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			name: undefined,
			edit: false,
			invalidLinkErr: undefined,
			copyIcon: 'clipboard'
		}
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
		host() {
			return `${ window.location.protocol }//${ window.location.host }`
		},
		fullShortLink() {
			return `${ this.host }/link/public/${ this.link.id }`
		}
	},
	methods: {
		close() {
			this.$modal.hide('shareLink')
		},
		copy() {
			this.copyIcon = 'check'
			this.$clipboard(this.fullShortLink)
			this.$toast.success('URL copied to clipboard!')
			setTimeout(() => {
				this.copyIcon = 'clipboard'
			}, 1000)
		}
	}
}
</script>

<style lang="scss" scoped>
	.add-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

		.actions {
			display: flex;
			align-items: center;
			margin-top: 1rem;
		}

		& button {
			display: flex;
			align-items: center;
			margin-right: 1rem;

			& div {
				margin-right: 0.5rem;
			}
		}

		& .error {
			margin-top: 0.5rem;
			color: var(--text-light);
		}

		& .link {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: var(--background-2nd);
            border-radius: var(--border-radius);
            margin-top: 1rem;

            & p {
                user-select: all;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
            }

            & div {
                margin-left: auto;
				flex-shrink: 0;
            }

			& input {
				height: 20px;
			}
        }
	}
</style>