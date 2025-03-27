import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import manifest from './manifest.config.js'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
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
