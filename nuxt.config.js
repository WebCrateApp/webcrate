import pkg from './package.json'

export default {
	srcDir: 'client/',
	components: true,

	target: 'static',

	ssr: false,

	server: {
		port: 3000,
		host: '0.0.0.0'
	},

	serverMiddleware: [
		'@/../server/index.ts'
	],

	env: {
		appVersion: pkg.version
	},

	loading: {
		color: 'var(--text)'
	},

	loadingIndicator: {
		name: 'pulse',
		color: 'var(--text)',
		background: 'var(--background-2nd)'
	},

	buildModules: [
		'@nuxt/typescript-build',
		'@nuxtjs/pwa'
	],

	pwa: {
		manifest: {
			name: 'WebCrate App',
			short_name: 'WebCrate',
			description: `WebCrate helps you organize and share links, articles and more from around the web. It's more than just a bookmarking tool.`,
			theme_color: '#F7F6F4',
			share_target: {
				action: '/',
				method: 'GET',
				params: {
					title: 'title',
					text: 'text',
					url: 'url'
				}
			}
		}
	},

	plugins: [
		{
			src: '~/plugins/confirm/index.js',
			mode: 'client'
		},
		{
			src: '~/plugins/prompt/index.js',
			mode: 'client'
		},
		{
			src: '~/plugins/localConfig.js',
			mode: 'client'
		},
		'~/plugins/api.js',
		'~/plugins/vue-librarys.js',
		'~/plugins/helpers.js',
		'~/plugins/directives.js',
		'~/plugins/axios.js'
	],

	modules: [
		'@nuxtjs/axios',
		'@blokwise/dynamic'
	],

	axios: {
		browserBaseURL: '/'
	},

	css: [
		'@/assets/main.scss'
	],

	build: {},

	head: {
		title: 'WebCrate - Organize the Web',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, maximum-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: 'WebCrate helps you organize and share links, articles and more from around the web. It\'s more than just a bookmarking tool.'
			},
			{
				hid: 'title',
				name: 'title',
				content: 'WebCrate - Organize the Web'
			},
			{
				hid: 'og:image',
				property: 'og:image',
				// Must use externally hosted image because we can't use relative path with og:image and we don't know the root of the site at build time
				content: 'https://webcrate.fra1.cdn.digitaloceanspaces.com/static/banner.png'
			}
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.png'
		}]
	},

	telemetry: false
}