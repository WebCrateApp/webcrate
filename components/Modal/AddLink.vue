<template>
  <Modal class="add-modal" @close="close">
    <h1>Add a new Link</h1>
    <input v-model="newLink" class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="https://piedpiper.com">
    <div class="dropdown">
      <v-select
        v-if="!currentCrate"
        v-model="selectedCrate"
        :reduce="item => item.id"
        :options="crates"
        label="name"
        placeholder="Select a Crate"
        @open="isOpen = true"
        @close="closeDropdown"
      ></v-select>
    </div>
    <button class="primary-button" @click="add">
      <Icon name="add" />Add Link
    </button>
    <p v-if="invalidLinkErr" class="error">
      Error: {{ invalidLinkErr }}
    </p>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			newLink: undefined,
			selectedCrate: undefined,
			invalidLinkErr: undefined,
			isOpen: false
		}
	},
	computed: {
		showModal: {
			set(value) {
				this.$store.commit('SET_SHOW_MODAL', { modal: 'addLink', value })
			},
			get() {
				return this.$store.state.modals.addLink
			}
		},
		currentCrate() {
			return this.$store.state.currentCrate
		},
		crates() {
			return this.$store.state.crates
		}
	},
	methods: {
		add() {
			const url = this.newLink
			if (!url) {
				this.invalidLinkErr = 'Please enter a valid URL'
				return
			}

			const crate = this.currentCrate || this.selectedCrate
			if (!crate) {
				this.invalidLinkErr = 'Please select a Crate'
				return
			}

			this.$store.dispatch('ADD_LINK', { url, crate }).then(() => {
				this.newLink = undefined
				this.selectedCrate = undefined
				this.invalidLinkErr = undefined
				this.showModal = false
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
				this.showModal = false
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
	}
</style>