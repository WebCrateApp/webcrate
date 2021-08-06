<template>
  <Modal class="add-modal" @close="close">
    <h1>Share this link publicly</h1>
    <p>A public link can be shared with anyone using the sharing URL below. When someone visits the URL they are redirected to the original link. Your link title and description will be shown in link previews.</p>
    <div v-if="!edit" class="link">
      <p>{{ fullShortLink }}</p>
      <Icon :name="copyIcon" @click.native.stop="copy" />
    </div>

    <div v-else class="link">
      <input v-model="shortCode" class="no-input" />
    </div>

    <div v-if="!edit" class="actions">
      <button class="primary-button" @click.stop="close">
        Okay
      </button>
      <button v-if="!edit" class="button" @click.stop="edit = true">
        Edit slug
      </button>
    </div>

    <div v-else class="actions">
      <button class="primary-button" @click.stop="save">
        Save
      </button>
    </div>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			name: undefined,
			edit: false,
			shortCode: undefined,
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
			return `${ this.host }/s/${ this.shortCode }`
		}
	},
	created() {
		this.shortCode = this.link.redirect.shortCode ? this.link.redirect.shortCode : this.link.id
	},
	methods: {
		save() {
			const parsed = this.shortCode.split(' ').join('-')

			this.link = {
				...this.link,
				redirect: { enabled: true, shortCode: parsed }
			}

			this.$store.dispatch('CHANGE_LINK', {
				linkId: this.link.id,
				changes: {
					'redirect.shortCode': parsed
				}
			})

			this.edit = false

			this.$toast.success('Slug changed!')
		},
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
            }

            & div {
                margin-left: auto;
            }

			& input {
				height: 20px;
			}
        }
	}
</style>