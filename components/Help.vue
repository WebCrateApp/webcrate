<template>
  <div v-shortkey="['ctrl', 'h']" class="help-wrapper" @shortkey="show = !show">
    <div v-if="shouldShow" v-click-outside="close" class="help-widget">
      <!-- <a href="https://webcrate.app/about" target="_blank" rel="noopener" class="no-button">
        <Icon name="heart" /><span>About</span>
      </a> -->
      <a href="https://webcrate.app/releases" target="_blank" rel="noopener" class="no-button">
        <Icon name="gift" /><span>What's new?</span>
      </a>
      <a href="https://webcrate.app/docs" target="_blank" rel="noopener" class="no-button">
        <Icon name="docs" /><span>Documentation</span>
      </a>
      <a href="https://github.com/WebCrateApp/feedback" target="_blank" rel="noopener" class="no-button">
        <Icon name="feedback" /><span>Feedback</span>
      </a>
      <hr>
      <a class="no-button" @click="showBookmarkletModal">
        <Icon name="bookmark" /><span>Get bookmarklet</span>
      </a>
      <a class="no-button" href="https://webcrate.app/docs/links#browser-extension" target="_blank" rel="noopener">
        <Icon name="desktop" /><span>Browser Extension</span>
      </a>
      <hr>
      <a class="no-button" @click="toggleTheme">
        <Icon v-if="isDark" name="sun" />
        <Icon v-else name="moon" />
        <span>Change theme</span>
      </a>
      <hr>
      <p>v{{ version }}</p>
    </div>
    <div class="bottom">
      <Icon v-if="!shouldShow" name="help" class="help-icon" @click.native.stop="show" />
      <Icon v-else name="close" class="help-icon" @click.native.stop="close" />
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	directives: {
		ClickOutside
	},
	data() {
		return {
			shouldShow: false,
			canChange: true,
			isDark: false
		}
	},
	computed: {
		version() {
			return this.$version()
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

			&:hover, &:focus {
				border: 2px solid var(--grey);
			}
		}

		.bottom {
			display: flex;
			justify-content: flex-end;
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
</style>