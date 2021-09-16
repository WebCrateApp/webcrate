<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="var(--grey)" viewBox="0 0 48 48">
        <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
      </svg>

      <div v-if="statusCode === 404">
        <div class="title">
          Page not found
        </div>
        <p class="description">
          This page or crate either doesn't exist or you were trying to access a crate which was deleted/set to private
        </p>
      </div>
      <div v-else>
        <div class="title">
          {{ message }}
        </div>
        <p class="description">
          If this error persists, please report it by <a :href="`https://github.com/WebCrateApp/webcrate/issues/new?assignees=BetaHuhn&labels=bug%2Ctriage&template=bug_report.yml${ version ? `&version=v${ version }` : '' }&title=${ message }&context=${ errorString }`">opening an issue on GitHub</a>.
        </p>
      </div>

      <div class="links">
        <a class="error-link" href="/">Go Back Home</a>
        <a class="error-link" href="https://webcrate.app/docs">View Documentation</a>
        <a class="error-link" href="https://webcrate.app">What's WebCrate?</a>
      </div>

      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="165" height="36" viewBox="0 0 165 36">
          <defs>
            <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0" stop-color="#f5be6b" />
              <stop offset="1" stop-color="#df9930" />
            </linearGradient>
          </defs>
          <g id="Rechteck_532" data-name="Rechteck 532" stroke="#f5be6b" stroke-width="5" fill="url(#linear-gradient)">
            <rect width="36" height="36" rx="7" stroke="none" />
            <rect
              x="2.5"
              y="2.5"
              width="31"
              height="31"
              rx="4.5"
              fill="none"
            />
          </g>
          <text
            id="WebCrate"
            transform="translate(48 28)"
            fill="var(--text)"
            font-size="26"
            font-family="SegoeUI-Semibold, Segoe UI, Inter UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            font-weight="600"
          ><tspan x="0" y="0">WebCrate</tspan></text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'NuxtError',
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	head() {
		return {
			title: this.message,
			meta: [
				{
					name: 'viewport',
					content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0'
				}
			]
		}
	},
	computed: {
		statusCode() {
			return (this.error && this.error.statusCode) || 500
		},
		errorString() {
			try {
				return JSON.stringify(this.error)
			} catch (e) {
				return e.message
			}
		},
		message() {
			return this.error.message || '<%= messages.client_error %>'
		},
		version() {
			return this.$version()
		}
	}
}
</script>

<style>
	.__nuxt-error-page {
		padding: 1rem;
		background: var(--background);
		color: var(--text);
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-family: sans-serif;
		font-weight: 100 !important;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		-webkit-font-smoothing: antialiased;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.__nuxt-error-page .error {
		max-width: 500px;
	}
	.__nuxt-error-page .title {
		font-size: 1.5rem;
		margin-top: 15px;
		color: var(--text);
		margin-bottom: 8px;
	}
	.__nuxt-error-page .description {
		color: var(--text-light);
		line-height: 21px;
		margin-bottom: 10px;
	}
	.__nuxt-error-page a {
		color: var(--text) !important;
		font-weight: 500;
		text-decoration: none;
	}
	.__nuxt-error-page .logo {
		position: fixed;
		top: 2rem;
		left: 2rem;
	}
	.__nuxt-error-page .links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		margin-top: 2rem;
	}
	.__nuxt-error-page .links a {
		color: var(--text) !important;
		text-decoration: none;
		flex-shrink: 0;
		margin: 0.5rem 1rem;
	}
</style>