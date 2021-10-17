<template>
  <Modal v-if="show" class="prompt-modal" @close="cancel">
    <h1>{{ title }}</h1>
    <p v-if="message">
      {{ message }}
    </p>
    <input v-model="value" v-focus class="input" :placeholder="placeholder" />
    <div class="buttons">
      <button v-shortkey="['enter']" :class="danger ? 'danger-button' : 'primary-button'" @click.stop="done" @shortkey="done">
        {{ confirmText }}
      </button>
      <button class="button" @click.stop="cancel">
        {{ cancelText }}
      </button>
    </div>
  </Modal>
</template>

<script>
import { events } from '@/plugins/prompt/events'

export default {
	name: 'PromptModal',
	data() {
		return {
			show: false,
			message: null,
			title: null,
			value: null,
			placeholder: null,
			confirmText: null,
			cancelText: null,
			danger: true,
			canClose: false
		}
	},
	mounted() {
		events.$on('open', this.open)
	},
	methods: {
		open({ title, message, confirmText, cancelText, danger, value, placeholder }) {
			this.show = true
			this.title = title
			this.message = message
			this.confirmText = confirmText
			this.cancelText = cancelText
			this.danger = danger
			this.value = value
			this.placeholder = placeholder

			// Prevent modal from closing itself
			setTimeout(() => {
				this.canClose = true
			}, 500)
		},
		done() {
			events.$emit('done', this.value)
			this.close()
		},
		cancel() {
			if (this.canClose) {
				events.$emit('done', null)
				this.close()
			}
		},
		close() {
			this.show = false
			this.canClose = false
		}
	}
}
</script>

<style lang="scss" scoped>
	.prompt-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

		& p {
			margin-bottom: 1rem;
		}

		.buttons {
			display: flex;
			align-items: center;
			position: relative;
			margin-top: 1rem;

			& button {
				margin-right: 0.5rem;
			}
		}
	}
</style>