<template>
  <Modal v-if="show" class="confirm-modal" @close="cancel">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <div class="buttons">
      <button v-shortkey="['enter']" :class="danger ? 'danger-button' : 'primary-button'" @click="confirm" @shortkey="confirm">
        {{ confirmText }}
      </button>
      <button class="button" @click="cancel">
        {{ cancelText }}
      </button>
    </div>
  </Modal>
</template>

<script>
import { events } from '@/plugins/confirm/events'

export default {
	name: 'ConfirmModal',
	data() {
		return {
			show: false,
			message: null,
			title: null,
			confirmText: null,
			cancelText: null,
			danger: true
		}
	},
	mounted() {
		events.$on('open', this.open)
	},
	methods: {
		open({ title, message, confirmText, cancelText, danger }) {
			this.show = true
			this.title = title
			this.message = message
			this.confirmText = confirmText
			this.cancelText = cancelText
			this.danger = danger
		},
		confirm() {
			events.$emit('confirmed', true)
			this.show = false
		},
		cancel() {
			events.$emit('confirmed', false)
			this.show = false
		}
	}
}
</script>

<style lang="scss" scoped>
	.confirm-modal {
		& h1 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		& p {
			margin-bottom: 1rem;
		}
	}
</style>