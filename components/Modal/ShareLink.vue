<template>
  <Modal class="add-modal" @close="close">
    <h1>Share this link publicly</h1>
    <p>The sharing URL will redirect the user to the original URL you added. The link title and description will be shown in link previews.</p>
    <div v-if="!edit" class="link">
      <p>{{ fullShortLink }}</p>
      <Icon :name="copyIcon" @click.native.stop="copy" />
    </div>

    <div v-else-if="edit" class="inputs">
      <input v-model="shortCode" v-focus class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="New short code">
    </div>

    <div class="actions">
      <button v-if="!edit" class="primary-button" @click="edit = true">
        <Icon name="edit" />Edit short code
      </button>
      <button v-else class="primary-button" @click="edit = false">
        Save
      </button>
      <button class="button" @click="close">
        Close
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
			set(value) {
				this.$modal.setData({ link: value })
			},
			get() {
				return this.$store.state.modal.data.link
			}
		},
		host() {
			return `${ window.location.protocol }//${ window.location.host }`
		},
		fullShortLink() {
			return `${ this.host }/r/${ this.link.id }`
		}
	},
	methods: {
		add() {
			const name = this.name
			if (!name) return

			this.$store.dispatch('CHANGE_NAME', name).then(() => {
				this.name = undefined
				this.invalidLinkErr = undefined

				this.close()
			}).catch((err) => {
				this.invalidLinkErr = err.message
				console.log(err)
			})
		},
		close() {
			this.$modal.hide('shareLink')
		},
		copy() {
			this.copyIcon = 'check'
			this.$clipboard(this.fullShortLink)
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

		.inputs {
			margin-top: 1rem;
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
        }
	}
</style>