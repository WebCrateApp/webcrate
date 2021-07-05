export default {
	components: true,

	target: 'static',

	ssr: false,

	server: {
		port: 3000,
		host: '0.0.0.0'
	},

	serverMiddleware: [
		'~/server/server.ts'
	],

	buildModules: [
		'@nuxt/typescript-build'
	],

	modules: [
		'@nuxtjs/axios',
		'@blokwise/dynamic'
	],

	axios: {
		browserBaseURL: '/'
	},

	build: {},

	head: {
		title: 'webcrate',
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