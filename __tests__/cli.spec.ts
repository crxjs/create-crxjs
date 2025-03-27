import type { SyncOptions, SyncResult } from 'execa'
import fs from 'node:fs'
import path from 'node:path'
import { execaCommandSync } from 'execa'
import { afterEach, beforeAll, expect, it } from 'vitest'

const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.mjs')
const TEMP_PATH = path.join(__dirname, '..')

const projectName = 'test-app'
const genPath = path.join(__dirname, projectName)
const genPathWithSubfolder = path.join(__dirname, 'subfolder', projectName)

function run<SO extends SyncOptions>(args: string[], options?: SO): SyncResult<SO> {
  return execaCommandSync(`node ${CLI_PATH} ${args.join(' ')}`, options)
}

// Helper to create a non-empty directory
function createNonEmptyDir(overrideFolder?: string) {
  // Create the temporary directory
  const newNonEmptyFolder = overrideFolder || genPath
  fs.mkdirSync(newNonEmptyFolder, { recursive: true })

  // Create a package.json file
  const pkgJson = path.join(newNonEmptyFolder, 'package.json')
  fs.writeFileSync(pkgJson, '{ "foo": "bar" }')
}

// Vue 3 starter template
const templateFiles = fs
  .readdirSync(path.join(TEMP_PATH, 'template-vue'))
  // _gitignore is renamed to .gitignore
  .map(filePath => (filePath === '_gitignore' ? '.gitignore' : filePath))
  .sort()

// React starter template
const templateFilesReact = fs
  .readdirSync(path.join(TEMP_PATH, 'template-react'))
  // _gitignore is renamed to .gitignore
  .map(filePath => (filePath === '_gitignore' ? '.gitignore' : filePath))
  .sort()

function clearAnyPreviousFolders() {
  if (fs.existsSync(genPath)) {
    fs.rmSync(genPath, { recursive: true, force: true })
  }
  if (fs.existsSync(genPathWithSubfolder)) {
    fs.rmSync(genPathWithSubfolder, { recursive: true, force: true })
  }
}

beforeAll(() => clearAnyPreviousFolders())
afterEach(() => clearAnyPreviousFolders())

it('prompts for the project name if none supplied', () => {
  const { stdout } = run([])
  expect(stdout).toContain('Project name:')
})

it('prompts for the framework if none supplied when target dir is current directory', () => {
  fs.mkdirSync(genPath, { recursive: true })
  const { stdout } = run(['.'], { cwd: genPath })
  expect(stdout).toContain('Select a framework:')
})

it('prompts for the framework if none supplied', () => {
  const { stdout } = run([projectName])
  expect(stdout).toContain('Select a framework:')
})

it('prompts for the framework on not supplying a value for --template', () => {
  const { stdout } = run([projectName, '--template'])
  expect(stdout).toContain('Select a framework:')
})

it('prompts for the framework on supplying an invalid template', () => {
  const { stdout } = run([projectName, '--template', 'unknown'])
  expect(stdout).toContain(
    `"unknown" isn't a valid template. Please choose from below:`,
  )
})

it('asks to overwrite non-empty target directory', () => {
  createNonEmptyDir()
  const { stdout } = run([projectName], { cwd: __dirname })
  expect(stdout).toContain(`Target directory "${projectName}" is not empty.`)
})

it('asks to overwrite non-empty target directory with subfolder', () => {
  createNonEmptyDir(genPathWithSubfolder)
  const { stdout } = run([`subfolder/${projectName}`], { cwd: __dirname })
  expect(stdout).toContain(
    `Target directory "subfolder/${projectName}" is not empty.`,
  )
})

it('asks to overwrite non-empty current directory', () => {
  createNonEmptyDir()
  const { stdout } = run(['.'], { cwd: genPath })
  expect(stdout).toContain(`Current directory is not empty.`)
})

it('successfully scaffolds a project based on vue starter template', () => {
  const { stdout } = run([projectName, '--template', 'vue'], {
    cwd: __dirname,
  })
  const generatedFiles = fs.readdirSync(genPath).sort()

  // Assertions
  expect(stdout).toContain(`Scaffolding project in ${genPath}`)
  expect(templateFiles).toEqual(generatedFiles)
})

it('successfully scaffolds a project with subfolder based on react starter template', () => {
  const { stdout } = run([`subfolder/${projectName}`, '--template', 'react'], {
    cwd: __dirname,
  })
  const generatedFiles = fs.readdirSync(genPathWithSubfolder).sort()

  // Assertions
  expect(stdout).toContain(`Scaffolding project in ${genPathWithSubfolder}`)
  expect(templateFilesReact).toEqual(generatedFiles)
})

it('works with the -t alias', () => {
  const { stdout } = run([projectName, '-t', 'vue'], {
    cwd: __dirname,
  })
  const generatedFiles = fs.readdirSync(genPath).sort()

  // Assertions
  expect(stdout).toContain(`Scaffolding project in ${genPath}`)
  expect(templateFiles).toEqual(generatedFiles)
})

it('accepts command line override for --overwrite', () => {
  createNonEmptyDir()
  const { stdout } = run(['.', '--overwrite', 'ignore'], { cwd: genPath })
  expect(stdout).not.toContain(`Current directory is not empty.`)
})

it('return help usage how to use create-crxjs', () => {
  const { stdout } = run(['--help'], { cwd: __dirname })
  const message = 'Usage: create-crxjs [OPTION]... [DIRECTORY]'
  expect(stdout).toContain(message)
})

it('return help usage how to use create-crxjs with -h alias', () => {
  const { stdout } = run(['--h'], { cwd: __dirname })
  const message = 'Usage: create-crxjs [OPTION]... [DIRECTORY]'
  expect(stdout).toContain(message)
})
