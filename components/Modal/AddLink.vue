<template>
  <Modal class="add-modal" @close="showAddLinkModal = false">
    <h1>Add a new Link</h1>
    <input v-model="newLink" class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="https://piedpiper.com">
    <button class="primary-button" @click="addLink">
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
			invalidLinkErr: undefined
		}
	},
	computed: {
		showAddLinkModal: {
			set(value) {
				this.$store.commit('SET_SHOW_ADD_LINK_MODAL', value)
			},
			get() {
				return this.$store.state.showAddLinkModal
			}
		},
		currentCrate() {
			return this.$store.state.currentCrate
		}
	},
	methods: {
		addLink() {
			const value = this.newLink
			if (!value) return

			this.$store.dispatch('ADD_LINK', { url: value, crate: this.currentCrate }).then(() => {
				this.newLink = undefined
				this.invalidLinkErr = undefined
				this.showAddLinkModal = false
			}).catch((err) => {
				this.invalidLinkErr = err.message
				console.log(err)
			})
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

		& input {
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
	}
</style>