#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as prompts from '@clack/prompts'
import mri from 'mri'
import { dim, green } from 'picocolors'
import { defaultTargetDir, renameFiles } from './config'
import { FRAMEWORKS, HELP_MESSAGE, TEMPLATES } from './constant'
import {
  copy,
  emptyDir,
  formatTargetDir,
  generateBanner,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  toValidPackageName,
} from './utils'

const argv = mri<{
  template?: string
  help?: boolean
  overwrite?: boolean
}>(process.argv.slice(2), {
  alias: { h: 'help', t: 'template' },
  boolean: ['help', 'overwrite'],
  string: ['template'],
})

const cwd = process.cwd()

async function init() {
  prompts.intro(generateBanner('create-crxjs - quickly start a chrome extension'))
  const argTargetDir = argv._[0]
    ? formatTargetDir(String(argv._[0]))
    : undefined
  const argTemplate = argv.template
  const argOverwrite = argv.overwrite

  const help = argv.help
  if (help) {
    console.log(HELP_MESSAGE)
    return
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const cancel = () => prompts.cancel('Operation cancelled')

  // 1. Get project name and target dir
  let targetDir = argTargetDir
  if (!targetDir) {
    const projectName = await prompts.text({
      message: 'Project name:',
      defaultValue: defaultTargetDir,
      placeholder: defaultTargetDir,
    })
    if (prompts.isCancel(projectName))
      return cancel()
    targetDir = formatTargetDir(projectName)
  }

  // 2. Handle directory if exist and not empty
  if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
    const overwrite = argOverwrite
      ? 'yes'
      : await prompts.select({
        message:
            `${targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`
            } is not empty. Please choose how to proceed:`,
        options: [
          {
            label: 'Cancel operation',
            value: 'no',
          },
          {
            label: 'Remove existing files and continue',
            value: 'yes',
          },
          {
            label: 'Ignore files and continue',
            value: 'ignore',
          },
        ],
      })
    if (prompts.isCancel(overwrite))
      return cancel()
    switch (overwrite) {
      case 'yes':
        emptyDir(targetDir)
        break
      case 'no':
        cancel()
        return
    }
  }

  // 3. Get package name
  let packageName = path.basename(path.resolve(targetDir))
  if (!isValidPackageName(packageName)) {
    const packageNameResult = await prompts.text({
      message: 'Extension name:',
      defaultValue: toValidPackageName(packageName),
      placeholder: toValidPackageName(packageName),
      validate(dir) {
        if (!isValidPackageName(dir)) {
          return 'Invalid package.json name'
        }
      },
    })
    if (prompts.isCancel(packageNameResult))
      return cancel()
    packageName = packageNameResult
  }

  // 4. Choose a framework and variant
  let template = argTemplate
  let hasInvalidArgTemplate = false
  if (argTemplate && !TEMPLATES.includes(argTemplate)) {
    template = undefined
    hasInvalidArgTemplate = true
  }
  if (!template) {
    const framework = await prompts.select({
      message: hasInvalidArgTemplate
        ? `"${argTemplate}" isn't a valid template. Please choose from below: `
        : 'Select a framework:',
      options: FRAMEWORKS.map((framework) => {
        const frameworkColor = framework.color
        return {
          label: frameworkColor(framework.display || framework.name),
          value: framework,
        }
      }),
    })
    if (prompts.isCancel(framework))
      return cancel()

    const variant = await prompts.select({
      message: 'Select a variant:',
      options: framework.variants.map((variant) => {
        const variantColor = variant.color
        return {
          label: variantColor(variant.display || variant.name),
          value: variant.name,
        }
      }),
    })
    if (prompts.isCancel(variant))
      return cancel()

    template = variant
  }

  const root = path.join(cwd, targetDir)
  fs.mkdirSync(root, { recursive: true })

  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  prompts.log.step(`Scaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `templates/${template}`,
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    }
    else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter(f => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  )

  pkg.name = packageName

  write('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

  let doneMessage = ''
  const cdProjectName = path.relative(cwd, root)
  doneMessage += `Done. Now run:\n`
  if (root !== cwd) {
    doneMessage += `\n  cd ${
      cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
    }`
  }
  switch (pkgManager) {
    case 'yarn':
      doneMessage += '\n  yarn'
      doneMessage += '\n  yarn dev'
      break
    default:
      doneMessage += `\n  ${pkgManager} install`
      doneMessage += `\n  ${pkgManager} run dev`
      break
  }
  prompts.note(doneMessage, dim('Getting Started'))

  prompts.outro(green(` 🎉 You're all set!`))
}

init().catch((e) => {
  console.error(e)
})
