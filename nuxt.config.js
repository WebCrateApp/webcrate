import pkg from './package.json'

export default {
	components: true,

	target: 'static',

	ssr: false,

	server: {
		port: 3000,
		host: '0.0.0.0'
	},

	serverMiddleware: [
		'~/server/index.ts'
	],

	router: {
		extendRoutes(routes) {
			routes.push({
				path: '/home',
				redirect: '/'
			})
		}
	},

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
		'@nuxt/typescript-build'
	],

	plugins: [
		{
			src: '~/plugins/confirm/index.js',
			mode: 'client'
		},
		'~/plugins/api.js',
		'~/plugins/vue-select.js',
		'~/plugins/modals.js',
		'~/plugins/version.js'
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
		title: 'WebCrate',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [{
			charset: 'utf-8'
		},
		{
			name: 'viewport',
			content: 'width=device-width, initial-scale=1'
		},
		{
			hid: 'description',
			name: 'description',
			content: ''
		}
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}]
	},

	telemetry: false
}