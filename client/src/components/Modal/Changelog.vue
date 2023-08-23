<!-- eslint-disable vue/no-v-html -->
<template>
  <Modal class="changelog-modal" @close="close">
    <h1>Successfully updated to v{{ version }} 🎉</h1>
    <p>Your WebCrate instance just performed an update and is now on the latest version! The best way to stay up to date about the latest releases is to <a href="https://github.com/WebCrateApp/webcrate">watch the repository</a> on GitHub.</p>
    <div v-if="release" class="release-notes">
      <h2>Release notes</h2>
      <p>Here are the release notes for <a :href="`https://github.com/WebCrateApp/webcrate/releases/tag/v${ version }`">v{{ version }}</a>. You can also view them on <a :href="`https://github.com/WebCrateApp/webcrate/releases`">GitHub</a>.</p>
      <div class="wrapper release" v-html="release.html"></div>
    </div>
    <LoadingItem v-else-if="$fetchState.pending" height="60px" />
    <p v-else class="wrapper">
      Couldn't grab release notes automatically. You need to view them on <a :href="`https://github.com/WebCrateApp/webcrate/releases`">GitHub</a> directly.
    </p>
    <div class="wrapper release">
      <h3>Help improve WebCrate!</h3>
      <p>As WebCrate is still very early in its development, I'm currently looking to gather some feedback on the app in order to improve it and decide what features to focus on next. If this sounds interesting to you, hit me up on <a href="https://twitter.com/BetaHuhn">Twitter</a> or shoot me an email at <a href="mailto:hi@webcrate.app">hi@webcrate.app</a>, I would love to talk to you!</p>
    </div>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			canClose: false,
			isOpen: false,
			release: undefined
		}
	},
	async fetch() {
		const data = await this.$api.getGitHubRelease(`v${ this.version }`)

		console.log(data)
		this.release = data
	},
	computed: {
		version() {
			return this.$version()
		}
	},
	created() {
		// Prevent other old click events from closing modal
		setTimeout(() => {
			this.canClose = true
		}, 200)
	},
	methods: {
		copy() {
			this.$clipboard(this.code)
			this.$toast.success('Copied to clipboard!')
		},
		async close() {
			if (!this.isOpen && this.canClose) {
				await this.$api.sawConfig()
				this.$modal.hide()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.changelog-modal {
		& h1 {
			font-size: 1.4rem;
			margin-bottom: 1rem;
		}

		& a {
			color: var(--text-dark);
			text-decoration: underline;
		}
	}

	h2 {
		font-size: 1.1rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-weight: 550;
	}

	.release-notes {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.wrapper {
		background: var(--background-2nd);
		padding: 1rem;
		border-radius: var(--border-radius);
		margin-top: 1rem;
	}

	.release ::v-deep {
		font-size: 0.95rem;

		h3 {
			font-size: 1rem;
			margin-top: 0.5rem;
			margin-bottom: 0.5rem;

			&:first-child {
				margin-top: 0;
			}
		}

		a {
			color: var(--text-dark);
		}

		code {
			background: var(--grey);
			padding: 0.2rem;
			border-radius: 5px;
		}
	}
</style>