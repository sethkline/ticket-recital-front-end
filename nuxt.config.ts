import path from 'path';
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Reverence Studios Recital',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'Ticket System',
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
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css',],
  devtools: { enabled: true },
  modules: ['@nuxtjs/strapi', '@pinia/nuxt', 'nuxt-primevue', 'nuxt-socket-io'],
    strapi: {
      url: process.env.STRAPI_URL || 'https:recital.reverence.dance/api',
      prefix: '/api',
      admin: '/admin',
      version: 'v4',
      cookie: {
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true
      },
      cookieName: 'strapi_jwt'
    },
    primevue: {
      options: {
        unstyled: true
      },
      importPT: { from: path.resolve(__dirname, './presets/lara/') }
  },
  io: {
    sockets: [{
      name: 'main',
      url: process.env.STRAPI_URL,
    }]
  },
  runtimeConfig: {
    public: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRAPI_URL: process.env.STRAPI_URL
    }
  }

})
