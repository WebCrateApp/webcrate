<template>
  <Modal class="add-modal" @close="close">
    <h1>Add an external Crate</h1>
    <p>You can import a external crate, meaning a crate which exists in another WebCrate instance and is set to public.</p>
    <p>Learn more in the <a href="https://webcrate.app/docs/crates/external-crates" target="_blank" rel="noopener">documentation.</a></p>
    <div class="inputs">
      <input v-model="url" class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="URL of external crate">
    </div>
    <button class="primary-button" @click="add">
      <Icon name="add" />Add Crate
    </button>
    <p v-if="invalidLinkErr" class="error">
      Error: {{ invalidLinkErr }}
    </p>
  </Modal>
</template>

<script>
import emojis from '@/server/utils/emojis'

export default {
	data() {
		return {
			url: undefined,
			invalidLinkErr: undefined
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.icon]
		}
	},
	methods: {
		add() {
			const url = this.url
			if (!url) return

			this.$store.dispatch('ADD_EXTERNAL_CRATE', url).then((crate) => {
				this.url = undefined
				this.invalidLinkErr = undefined
				this.$store.commit('SET_CURRENT_CRATE', crate.id)
				this.$router.push(`/crate/${ crate.id }`)
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