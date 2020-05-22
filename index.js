#!/usr/bin/env node

// ---------------------------------------- | Dependencies

const program = require('commander')
const replace = require('replace-in-file')

// ---------------------------------------- | Setup / Config

program
  .option('-f, --file <path>', 'Path to file')
  .option('-e, --env <name>', 'Name of environment')
  .option('--replace <string>', 'Replacement value')
  .option('--find <string>', 'Value to replace')
  .parse(process.argv)

const envMap = {
  int: ['dev', 'development', 'int'],
  demo: ['demo'],
  prod: ['prod', 'production'],
  other: ['other']
}

// ---------------------------------------- | Replacer

class EnvReplacer {
  constructor({ file = './dist/index.html', env = 'int', find = undefined, replace = undefined } = {}) {
    this.file = file
    this.env = env
    this.find = find
    this.replace = replace
  }

  isEnv(env) {
    return envMap[env].includes(this.env)
  }

  isProd() {
    return envMap.prod.includes(this.env)
  }

  isInt() {
    return envMap.int.includes(this.env)
  }

  skipReplacement() {
    const allEnvs = Object.values(envMap).reduce((acc, val) => [...acc, ...val])
    return this.isInt() || !allEnvs.includes(this.env)
  }

  replaceCompAttrs() {
    if (this.skipReplacement()) return false
    replace.sync({
      files: this.file,
      from: /(env=")(\w*)"/g,
      to: `env="${this.env}"`
    })
  }

  replaceCompLib() {
    if (this.skipReplacement()) return false
    let replacement = this.replace || `components${!this.isProd() ? `-${this.env}` : ''}.crossroads.net`;
    return replace.sync({
      files: this.file,
      from: this.find || /components(-?\w*)?.crossroads.net/g,
      to: replacement
    })
  }
}

// ---------------------------------------- | Exports

module.exports = EnvReplacer

// ---------------------------------------- | The Task

const replacer = new EnvReplacer({ file: program.file, env: program.env, find: program.find, replace: program.replace })

// Replace component attributes to use the appropriate environment.
replacer.replaceCompAttrs()

// Replace reference to the library to point to production.
replacer.replaceCompLib()
