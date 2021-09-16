<template>
  <Modal class="add-modal" @close="close">
    <h1>Change your WebCrate's name</h1>
    <p>Make your WebCrate instance your own by giving it a name! The name will be displayed publicly when you share a crate.</p>
    <div class="inputs">
      <input v-model="name" v-focus class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="New name">
    </div>
    <button v-shortkey="['enter']" class="primary-button" @click="add" @shortkey="add">
      <Icon name="check" />Change name
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
	created() {
		this.name = this.$store.state.config.name
	},
	methods: {
		add() {
			const name = this.name
			if (!name) return

			this.$store.dispatch('CHANGE_NAME', name).then(() => {
				this.name = undefined
				this.invalidLinkErr = undefined

				this.$toast.success('Name changed!')

				this.close()
			}).catch((err) => {
				this.invalidLinkErr = err.message
				console.log(err)
			})
		},
		close() {
			this.$modal.hide()
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

		.inputs {
			display: flex;
			align-items: center;
			margin-bottom: 1rem;
			position: relative;
			margin-top: 1rem;

			& button {
				margin-right: 0.5rem;
			}
		}

		& button {
			display: flex;
			align-items: center;

			& div {
				margin-right: 0.3rem;
				margin-left: -3px;
			}
		}

		& p {
			margin-bottom: 0.5rem;
		}

		& a {
			color: var(--text-dark);

			&:hover {
				text-decoration: underline;
			}
		}

		& .error {
			margin-top: 0.5rem;
			color: var(--text-light);
		}

		.add-crate-emoji-picker {
			position: absolute;
			z-index: 10;
			left: 0;
			top: 3rem;
		}
	}
</style>