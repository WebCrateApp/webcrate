<template>
  <Modal class="add-modal" overflow="visible" @close="close">
    <input
      v-model="linkTitle"
      class="no-input headline"
      placeholder="Link Name (optional)"
      title="Click to edit title"
    />
    <input v-model="inputValue" v-focus class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="https://piedpiper.com">
    <div class="dropdown">
      <v-select
        v-if="!currentCrate"
        v-model="selectedCrate"
        :reduce="item => item.id"
        :options="crates"
        :get-option-label="(crate) => `${ emojiIcon(crate.icon) } ${ crate.name }`"
        placeholder="Select a crate (optional)"
        @open="isOpen = true"
        @close="closeDropdown"
      ></v-select>
    </div>
    <button v-if="!isLoading" v-shortkey="['enter']" class="primary-button" @click="add" @shortkey="add">
      <Icon name="add" />Add Link
    </button>
    <button v-else class="primary-button">
      <Icon name="loadingAnimated" />Adding Link...
    </button>
    <p v-if="invalidLinkErr" class="error">
      Error: {{ invalidLinkErr }}
    </p>
  </Modal>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	data() {
		return {
			selectedCrate: undefined,
			invalidLinkErr: undefined,
			isOpen: false,
			linkTitle: ''
		}
	},
	computed: {
		inputValue: {
			set(value) {
				this.$modal.setData({ inputValue: value })
			},
			get() {
				return this.$store.state.modal.data.inputValue
			}
		},
		currentCrate() {
			return this.$store.state.currentCrate
		},
		crates() {
			return this.$store.state.crates
		},
		isLoading() {
			return this.$nuxt.$loading.show
		}
	},
	beforeDestroy() {
		// Remove addUrl parameter if it exists
		const query = Object.assign({}, this.$route.query)
		if (query.addUrl) {
			delete query.addUrl
			this.$router.replace({ query })
		}

		this.inputValue = undefined
	},
	methods: {
		emojiIcon(name) {
			return emojis[name]
		},
		add() {
			const url = this.inputValue
			if (!url) {
				this.invalidLinkErr = 'Please enter a valid URL'
				return
			}
			const title = this.linkTitle

			const crate = this.selectedCrate || this.currentCrate

			this.$store.dispatch('ADD_LINK', { title, url, crate }).then((link) => {
				this.$toast.success('Link added!', {
					onClick: () => {
						if (crate !== undefined && crate !== this.currentCrate) {
							this.$switchToPageOrCrate(crate, { link: link.id })
							return
						}

						this.$modal.show('linkDetails', { link: link.id })
					}
				})

				this.$modal.hide()
			}).catch((err) => {
				this.invalidLinkErr = err.message
				console.log(err)
			})
		},
		closeDropdown() {
			// Delay enable closing of modal so select doesn't trigger close when dropdown is outside of modal
			setTimeout(() => {
				this.isOpen = false
			}, 500)
		},
		close() {
			if (!this.isOpen) {
				this.$modal.hide()
			}
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

		& button {
			display: flex;
			align-items: center;

			& div {
				margin-right: 0.3rem;
				margin-left: -3px;
			}
		}

		& .error {
			margin-top: 0.5rem;
			color: var(--text-light);
		}

		.dropdown {
			width: 200px;
			margin-top: 0.5rem;
			margin-bottom: 1rem;
			font-size: 0.9rem;
		}
        .no-input {
            width: 100%;
        }
        .headline {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
	}
</style>