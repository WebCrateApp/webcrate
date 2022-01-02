<template>
  <Modal class="add-modal" overflow="visible" @close="close">
    <h1 class="headline">
      Move this link to another crate
    </h1>
    <p>Select a crate to move the link:</p>
    <div class="dropdown">
      <v-select
        v-model="selectedCrate"
        :reduce="item => item.id"
        :options="crates"
        :get-option-label="(crate) => `${ emojiIcon(crate.icon) } ${ crate.name }`"
        placeholder="Select a crate (optional)"
        @open="isOpen = true"
        @close="closeDropdown"
      ></v-select>
    </div>
    <button v-if="selectedCrate !== currentCrate" v-shortkey="['enter']" class="primary-button" @click="save" @shortkey="save">
      <Icon name="check" size="17px" />Save changes
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
			isOpen: false
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
		linkId() {
			return this.$store.state.modal.data.linkId
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
	mounted() {
		this.selectedCrate = !this.currentCrate || this.currentCrate === 'null' ? null : this.currentCrate
	},
	methods: {
		emojiIcon(name) {
			return emojis[name]
		},
		async save() {
			if (!this.selectedCrate) {
				return
			}

			const crate = this.selectedCrate
			await this.$store.dispatch('MOVE_LINK', { linkId: this.linkId, crate: crate })

			this.$switchToPageOrCrate(crate)

			this.close()
		},
		closeDropdown() {
			// Delay enable closing of modal so select doesn't trigger close when dropdown is outside of modal
			setTimeout(() => {
				this.isOpen = false
			}, 500)
		},
		close() {
			if (!this.isOpen) {
				this.$modal.hide('changeCrate')
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