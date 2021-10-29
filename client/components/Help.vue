<template>
  <div v-shortkey="['ctrl', 'h']" class="help-wrapper" @shortkey="show = !show">
    <div v-if="shouldShow" v-click-outside="close" class="help-widget">
      <div v-if="!isPublic">
        <a href="https://webcrate.app/docs" target="_blank" rel="noopener" class="no-button">
          <Icon name="docs" /><span>Documentation</span>
        </a>
        <a href="https://github.com/WebCrateApp/webcrate/issues/new/choose" target="_blank" rel="noopener" class="no-button">
          <Icon name="feedback" /><span>Feedback</span>
        </a>
        <hr>
        <a class="no-button" @click="showBookmarkletModal">
          <Icon name="bookmark" /><span>Get Bookmarklet</span>
        </a>
        <a class="no-button" href="https://webcrate.app/docs/browser-extension" target="_blank" rel="noopener">
          <Icon name="desktop" /><span>Browser Extension</span>
        </a>
      </div>
      <div v-else>
        <a href="https://webcrate.app" target="_blank" rel="noopener" class="no-button">
          <Icon name="info" /><span>What's WebCrate?</span>
        </a>
        <a href="https://github.com/WebCrateApp/webcrate/issues/new/choose" target="_blank" rel="noopener" class="no-button">
          <Icon name="feedback" /><span>Feedback</span>
        </a>
      </div>
      <hr>
      <a v-if="!updateAvailable" href="https://github.com/WebCrateApp/webcrate/releases" target="_blank" rel="noopener" class="no-button">
        <Icon name="gift" /><span>What's new?</span>
      </a>
      <a v-if="updateAvailable" href="https://deta.space/library" target="_blank" rel="noopener" class="no-button">
        <div class="indicator"></div>
        <Icon name="gift" /><span>Update Available</span>
      </a>
      <a class="no-button" @click="toggleTheme">
        <Icon v-if="isDark" name="sun" />
        <Icon v-else name="moon" />
        <span>Change theme</span>
      </a>
      <hr>
      <p>v{{ version }}</p>
    </div>
    <div v-longpress="reload" class="bottom">
      <Icon v-if="!shouldShow" name="help" class="help-icon" @click.native.stop="show" />
      <Icon v-else name="close" class="help-icon" @click.native.stop="close" />
      <div v-if="updateAvailable && !shouldShow" class="indicator"></div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	directives: {
		ClickOutside
	},
	props: {
		isPublic: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			shouldShow: false,
			canChange: true,
			isDark: false
		}
	},
	computed: {
		config() {
			return this.$store.state.config
		},
		version() {
			return this.$version()
		},
		updateAvailable() {
			return this.config.hasUpdate
		}
	},
	created() {
		this.isDark = this.$darkmode.isDark()
	},
	methods: {
		close() {
			if (this.canChange) {
				this.shouldShow = false

				this.canChange = false
				setTimeout(() => {
					this.canChange = true
				}, 500)
			}
		},
		show() {
			if (this.canChange) {
				this.shouldShow = true

				this.canChange = false
				setTimeout(() => {
					this.canChange = true
				}, 500)
			}
		},
		reload() {
			window.location.reload()
		},
		showBookmarkletModal() {
			this.$modal.show('bookmarklet')
		},
		toggleTheme() {
			this.isDark = this.$darkmode.toggle()
		}
	}
}
</script>

<style lang="scss" scoped>
	.help-wrapper {
		position: fixed;
		z-index: 100;
		bottom: 2rem;
		right: 2rem;

		.help-icon {
			background: var(--background-2nd);
			border-radius: 100%;
			border: 2px solid var(--background-2nd);
			padding: 0.5rem;
			width: 40px;
			height: 40px;
			cursor: pointer;
			box-shadow: 0 5px 10px 5px rgba(117, 117, 117, 0.04);

			&:hover, &:focus {
				border: 2px solid var(--grey);
			}
		}

		.bottom {
			display: flex;
			justify-content: flex-end;
			position: relative;
		}

		.indicator {
			position: absolute;
			right: 0;
			width: 12px;
			height: 12px;
			background: var(--accent);
			border-radius: 100%;
			box-shadow: 0 0 0 0 rgb(217, 159, 51);
			animation: pulse-green 3s infinite;
		}

		@keyframes pulse-green {
			0% {
				transform: scale(0.95);
				box-shadow: 0 0 0 0 rgba(217, 159, 51, 0.7);
			}

			30% {
				transform: scale(1);
				box-shadow: 0 0 0 10px rgba(217, 159, 51, 0);
			}

			100% {
				transform: scale(0.95);
				box-shadow: 0 0 0 0 rgba(217, 159, 51, 0);
			}
		}

		.help-widget {
			background: var(--background-2nd);
			border-radius: var(--border-radius);
			border: 2px solid var(--grey);
			margin-bottom: 1rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;

			& a {
				padding: 0.8rem 1rem;
				text-align: left;
				font-size: 1rem;
				transition: background .2s ease;
				color: var(--text);
				text-decoration: none;
				display: flex;
				align-items: center;

				&:hover {
					background: var(--grey);
					transition: none;
				}

				& span {
					margin-right: 0.5rem;
				}

				& div {
					margin-right: 0.5rem;
				}
			}

			& p {
				text-align: center;
				padding: 0.5rem;
			}
		}
	}

	@media only screen and (max-width: 900px) {
		.help-wrapper {
			bottom: 1.5rem;
			right: 1.5rem;
		}
	}
</style>