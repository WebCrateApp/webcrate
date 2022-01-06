<template>
  <transition name="fade" appear="">
    <div class="modal-wrapper" :style="{ '--width': width, '--height': height, '--max-width': maxWidth, '--overflow': overflow, '--min-height': minHeight, '--padding': padding }">
      <transition name="moveIn" appear="">
        <div v-click-outside="close" v-shortkey="['esc']" class="modal-content" :class="centered && 'centered'" @shortkey="close">
          <div v-if="canExpand" class="action-bar">
            <p class="hover-button" @click.stop="expand">
              <Icon name="expand" size="18px" />Open as page
            </p>
            <div class="hover-icon">
              <Icon name="close" @click.native="close" />
            </div>
          </div>
          <Icon v-else name="close" class="close-icon" @click.native="close" />
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	directives: {
		ClickOutside
	},
	props: {
		maxWidth: {
			type: String,
			default: '900px'
		},
		width: {
			type: String,
			default: '95%'
		},
		height: {
			type: String,
			default: undefined
		},
		padding: {
			type: String,
			default: '1.5rem'
		},
		overflow: {
			type: String,
			default: 'auto'
		},
		minHeight: {
			type: String,
			default: undefined
		},
		centered: {
			type: Boolean,
			default: false
		},
		canClose: {
			type: Boolean,
			default: true
		},
		canExpand: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		close(e) {
			if (!this.canClose) return

			e.stopPropagation()

			// Prevent close click from triggering on another element below the modal
			document.body.classList.add('no-events')

			this.$emit('close')

			// After the delay, allow events to trigger again
			setTimeout(() => {
				document.body.classList.remove('no-events')
			}, 700)
		},
		expand() {
			this.$emit('expand')
		}
	}
}

</script>

<style lang="scss" scoped>
	.modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100vh;
		background: rgba(0, 0, 0, 0.548);
		z-index: 1000;
	}

	::-webkit-scrollbar {
		width: 0.7rem;
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--grey);
		border-radius: var(--border-radius);
		border: 0;
	}

	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 4px var(--background-2nd);
		border-radius: var(--border-radius);
	}

	.modal-content {
		background: var(--background);
		border-radius: var(--border-radius);
		max-width: var(--max-width);
		max-height: 85%;
		min-height: var(--min-height);
		width: var(--width);
		height: var(--height);
		position: absolute;
		left: 50%;
		top: 10%; // 5rem
		transform: translateX(-50%);
		padding: var(--padding);
		overflow-y: var(--overflow);
		scrollbar-width: thin;
		scrollbar-color: var(--grey) var(--background-2nd);

		&.centered {
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.close-icon {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		color: var(--text-light);
		z-index: 10;
		cursor: pointer;
		mix-blend-mode: difference;
	}

	.expand-icon {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		color: var(--text-light);
		z-index: 10;
		cursor: pointer;
	}

	.action-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: -0.7rem;
		margin-bottom: 0.3rem;

		& p {
			display: flex;
			align-items: center;
			color: var(--text-light);
			cursor: pointer;

			& div {
				margin-right: 0.3rem;
			}
		}

		& div {
			color: var(--text-light);
			cursor: pointer;
		}
	}

	.moveIn-enter-active,
	.moveIn-leave-active {
		transition: all .2s;
	}

	.moveIn-enter {
		transform: translateX(-50%) scale(0.9);
	}

	/* A11y: Disable transitions when reduced motion is turned on */
	@media (prefers-reduced-motion: reduce) {
		.moveIn-enter-active,
		.moveIn-leave-active,
		.fade-enter-active,
		.fade-leave-active {
			transition: none;
		}
	}
</style>