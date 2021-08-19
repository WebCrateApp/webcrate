<template>
  <Modal class="add-modal" overflow="visible" @close="close">
    <h1>Add a new Crate</h1>
    <div class="inputs">
      <button class="button" @click.stop="showEmojiPicker = !showEmojiPicker">
        {{ emojiIcon }}
      </button>
      <input v-model="name" v-focus class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="Name">
      <div v-if="showEmojiPicker" class="add-crate-emoji-picker">
        <EmojiPicker @selected="selectEmoji" @close="showEmojiPicker = false" />
      </div>
    </div>
    <button v-shortkey="['enter']" class="primary-button" @click="add" @shortkey="add">
      <Icon name="add" />Add Crate
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
			name: undefined,
			icon: undefined,
			invalidLinkErr: undefined,
			showEmojiPicker: false
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.icon]
		},
		currentCrate() {
			return this.$store.state.currentCrate
		},
		changePageOnSuccess: {
			set(value) {
				this.$modal.setData({ changePageOnSuccess: value })
			},
			get() {
				return this.$store.state.modal.data.changePageOnSuccess !== undefined ? this.$store.state.modal.data.changePageOnSuccess : true
			}
		}
	},
	created() {
		this.icon = this.randomEmoji()
	},
	methods: {
		add() {
			const name = this.name
			if (!name) return

			const icon = this.icon

			this.$store.dispatch('ADD_CRATE', { name, icon }).then((crate) => {
				this.name = undefined
				this.invalidLinkErr = undefined

				this.$toast.success('Crate added!', {
					onClick: () => {
						if (this.changePageOnSuccess) {
							this.$store.commit('SET_CURRENT_CRATE', crate.id)
							this.$router.push(`/crate/${ crate.id }`)
						}
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
		},
		selectEmoji(key) {
			this.showEmojiPicker = false
			this.icon = key
		},
		randomEmoji() {
			return Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]
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