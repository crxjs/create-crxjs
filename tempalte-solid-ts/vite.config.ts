import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import manifest from './manifest.config.ts'

export default defineConfig({
  plugins: [
    solid(),
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
