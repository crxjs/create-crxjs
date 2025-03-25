import path from 'node:path'
import url from 'node:url'
import { defineBuildConfig } from 'unbuild'
import { cc0LicenseText } from './scripts/constant'
import licensePlugin from './scripts/licensePlugin'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
  },
  hooks: {
    'rollup:options': function (_ctx, options) {
      options.plugins = [
        options.plugins,
        licensePlugin(
          path.resolve(__dirname, './LICENSE'),
          'create-crxjs license',
          'create-crxjs',
          `# License of the files in the directories starting with "template-" in create-crxjs\n`
          + `The files in the directories starting with "template-" in create-crxjs and files\n`
          + `generated from those files are licensed under the CC0 1.0 Universal license:\n\n${
            cc0LicenseText
          }\n\n`,
        ),
      ]
    },
  },
})
