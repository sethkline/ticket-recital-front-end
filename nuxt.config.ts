import path from 'path';
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Reverence Studios Recital',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Reverence Studios Recital'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato&display=swap'
        }
      ]
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {
        // configPath: '~/config/tailwind.config.js'
      },
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxtjs/strapi', '@pinia/nuxt', 'nuxt-primevue'],
    strapi: {
      url: process.env.STRAPI_URL || 'http://localhost:1337',
      prefix: '/api',
      admin: '/admin',
      version: 'v4',
      // cookie: {
      //   path: '/',
      //   maxAge: 14 * 24 * 60 * 60,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: true
      // },
      cookieName: 'strapi_jwt'
    },
    primevue: {
      options: {
        unstyled: true
      },
      importPT: { from: path.resolve(__dirname, './presets/lara/') }
  }
})
