<template>
  <div v-shortkey="['ctrl', 'h']" class="help-wrapper" @shortkey="show = !show">
    <div v-if="show" v-click-outside="close" class="help-widget">
      <a href="https://webcrate.deta.dev/" target="_blank" rel="noopener" class="no-button">
        <span>👨‍💻</span>About
      </a>
      <a href="https://webcrate.deta.dev/releases" target="_blank" rel="noopener" class="no-button">
        <span>🎁</span>What's new?
      </a>
      <a href="https://webcrate.deta.dev/docs" target="_blank" rel="noopener" class="no-button">
        <span>🤔</span>How-to guide
      </a>
      <hr>
      <a href="https://github.com/WebCrateApp/feedback" target="_blank" rel="noopener" class="no-button">
        <span>💬</span>Feedback
      </a>
      <hr>
      <p>v{{ version }}</p>
    </div>
    <div class="bottom">
      <Icon v-if="!show" name="help" class="help-icon" @click.native.stop="show = true" />
      <Icon v-else name="close" class="help-icon" @click.native.stop="show = false" />
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
			show: false
		}
	},
	computed: {
		version() {
			return this.$version()
		}
	},
	methods: {
		close() {
			this.show = false
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

                &:hover {
                    background: var(--grey);
                    transition: none;
                }

                & span {
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