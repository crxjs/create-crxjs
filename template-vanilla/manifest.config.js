import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  action: {
    default_popup: 'src/popup/index.html',
  },
  content_scripts: [{
    js: ['src/content/main.js'],
    matches: ['https://*/*'],
  }],
})
