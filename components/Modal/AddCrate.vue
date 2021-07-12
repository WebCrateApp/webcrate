<template>
  <Modal class="add-modal" @close="showModal = false">
    <h1>Add a new Crate</h1>
    <input v-model="name" class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="Name">
    <button class="primary-button" @click="add">
      <Icon name="add" />Add Crate
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
			name: undefined,
			invalidLinkErr: undefined
		}
	},
	computed: {
		showModal: {
			set(show) {
				this.$modal.set('addCrate', show)
			},
			get() {
				return this.$store.state.modals.addCrate
			}
		},
		currentCrate() {
			return this.$store.state.currentCrate
		}
	},
	methods: {
		add() {
			const value = this.name
			if (!value) return

			this.$store.dispatch('ADD_CRATE', { name: value }).then(() => {
				this.name = undefined
				this.invalidLinkErr = undefined
				this.showModal = false
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