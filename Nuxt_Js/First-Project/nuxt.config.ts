// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from 'path'
import svgLoader from 'vite-svg-loader'


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  vite: {
    plugins: [
      require('vite-svg-loader')(),
    ],
  },

  alias : {
    '@': resolve(__dirname, 'src')
  },

  css: [
    "~/assets/main.scss"
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@pinia/nuxt'],
})