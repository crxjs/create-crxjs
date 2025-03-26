import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import manifest from './manifest.config.js'

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
})
