// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: { 
      link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' }],
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },

  modules: ['@pinia/nuxt', '@nuxt/ui'],

  nitro: {
    plugins: [
      '~/server/plugins/telegram.ts'
    ]
  },
  css: [
    '@/node_modules/vue-preloader/dist/style.css',
    '~/styles/global.css',
  ],

  compatibilityDate: '2024-11-16'
})