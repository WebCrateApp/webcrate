<template>
  <Modal class="output-modal" @close="close">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <div class="link">
      <p>{{ value }}</p>
      <Icon :name="copyIcon" @click.native.stop="copy" />
    </div>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			isOpen: false,
			copyIcon: 'clipboard'
		}
	},
	computed: {
		value: {
			set(value) {
				this.$modal.setData({ inputValue: value })
			},
			get() {
				return this.$store.state.modal.data.inputValue
			}
		},
		title: {
			set(value) {
				this.$modal.setData({ title: value })
			},
			get() {
				return this.$store.state.modal.data.title
			}
		},
		message: {
			set(value) {
				this.$modal.setData({ message: value })
			},
			get() {
				return this.$store.state.modal.data.message
			}
		}
	},
	beforeDestroy() {
		this.value = undefined
		this.title = undefined
		this.message = undefined
	},
	methods: {
		copy() {
			this.copyIcon = 'check'
			this.$clipboard(this.value)
			this.$toast.success('Copied to clipboard!')
			setTimeout(() => {
				this.copyIcon = 'clipboard'
			}, 1000)
		},
		close() {
			if (!this.isOpen) {
				this.$modal.hide()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.output-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

        & .link {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: var(--background-2nd);
            border-radius: var(--border-radius);
            margin-top: 1rem;

            & p {
                user-select: all;
				overflow-y: hidden;
				word-wrap: break-word
            }

            & div {
                margin-left: auto;
				flex-shrink: 0;
            }
        }
	}
</style>