#!/usr/bin/env node

// ---------------------------------------- | Dependencies

const program = require('commander')
const replace = require('replace-in-file')

// ---------------------------------------- | Setup / Config

program
  .option('-f, --file <path>', 'Path to file')
  .option('-e, --env <name>', 'Name of environment')
  .parse(process.argv)

const envMap = {
  int: ['dev', 'development', 'int'],
  demo: ['demo'],
  prod: ['prod', 'production']
}

// ---------------------------------------- | Replacer

class EnvReplacer {
  constructor({ file = './dist/index.html', env = 'int' } = {}) {
    this.file = file
    this.env = env
  }

  isEnv(env) {
    return envMap[env].includes(this.env)
  }

  replaceCompAttrs() {
    if (!(this.isEnv('demo') || this.isEnv('prod'))) return false
    replace.sync({
      files: this.file,
      from: /(env=")(\w*)"/g,
      to: `env="${this.env}"`
    })
  }

  replaceCompLib() {
    if (!this.isEnv('prod')) return false
    replace.sync({
      files: this.file,
      from: /components-int.crossroads.net/g,
      to: 'components.crossroads.net'
    })
  }
}

// ---------------------------------------- | Exports

module.exports = EnvReplacer

// ---------------------------------------- | The Task

const replacer = new EnvReplacer({ file: program.file, env: program.env })

// Replace component attributes to use the appropriate environment.
replacer.replaceCompAttrs()

// Replace reference to the library to point to production.
replacer.replaceCompLib()
