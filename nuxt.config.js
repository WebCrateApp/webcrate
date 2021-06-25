export default {
  components: true,

  target: 'server',
  
  server: {
    port: 3000,
    host: `0.0.0.0`,
  },

  buildModules: [
    '@nuxt/typescript-build'
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {},

  build: {
  },

  head: {
    title: 'webcrate',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
}
