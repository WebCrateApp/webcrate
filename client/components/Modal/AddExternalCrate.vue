<template>
  <Modal class="add-modal" @close="close">
    <h1>Subscribe to an external Crate</h1>
    <p>You can subscribe to any public crate to keep up date with links which are added to it. Learn more in the <a href="https://webcrate.app/docs/crates/external-crates" target="_blank" rel="noopener">documentation.</a></p>
    <div class="inputs">
      <input v-model="url" v-focus class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="URL of external crate">
    </div>
    <button v-if="firstExternal && !url" class="no-button example" @click.stop="url = 'https://webcrate.maxs1.deta.app/crate/public/NUjr5C3Nn0Ef0YmM'">
      <Icon name="info" />Click here to use an example if you don't have a URL ready
    </button>
    <button v-shortkey="['enter']" class="primary-button" @click="add" @shortkey="add">
      <Icon name="add" />Subscribe
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
			url: undefined,
			invalidLinkErr: undefined
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.icon]
		},
		firstExternal() {
			return this.$store.state.modal.data.firstExternal ? this.$store.state.modal.data.firstExternal : false
		}
	},
	methods: {
		add() {
			const url = this.url
			if (!url) return

			this.$store.dispatch('ADD_EXTERNAL_CRATE', url).then((crate) => {
				this.url = undefined
				this.invalidLinkErr = undefined

				this.$toast.success('External crate added!', {
					onClick: () => {
						this.$store.commit('SET_CURRENT_CRATE', crate.id)
						this.$router.push(`/crate/external/${ crate.id }`)
					}
				})

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

		& .example {
			margin-bottom: 1rem;
			font-size: 1rem;
		}

		& p {
			margin-bottom: 0.5rem;
		}

		& a {
			color: var(--text-dark);
			text-decoration: underline;

			&:hover {
				color: var(--text);
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