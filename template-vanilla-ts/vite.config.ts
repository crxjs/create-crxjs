import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import manifest from './manifest.config.js'

export default defineConfig({
  plugins: [
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
