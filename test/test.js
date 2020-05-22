const assert = require('assert')
const fs = require('fs')
const Replacer = require('../index')

// ---------------------------------------- | Utilities

const tmpFilePath = './test/test-tmp.html'

const initTmpFile = function () {
  rmTmpFile()
  fs.copyFileSync('./test/test.html', tmpFilePath)
}

const rmTmpFile = function () {
  if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
}

const checkFileForAttrs = function (env) {
  const content = fs.readFileSync(tmpFilePath, { encoding: 'utf8' })
  const match = content.match(new RegExp(`env="${env}"`, 'g'))
  return (match && match.length == 3) || false
}

const checkFileForLib = function (env) {
  const content = fs.readFileSync(tmpFilePath, { encoding: 'utf8' })
  const pattern = env == 'prod' ? 'components.crossroads.net' : `components-${env}.crossroads.net`
  const match = content.match(new RegExp(pattern, 'g'))
  return (match && match.length == 1) || false
}

// ---------------------------------------- | constructor()

describe('constructor()', function () {
  it('sets default values', function () {
    const task = new Replacer()
    assert.equal(task.env, 'int')
    assert.equal(task.file, './dist/index.html')
  })
  it('sets file and env properties', function () {
    const task = new Replacer({ file: './test/test.html', env: 'demo' })
    assert.equal(task.env, 'demo')
    assert.equal(task.file, './test/test.html')
  })
})

// ---------------------------------------- | isEnv()

describe('isEnv()', function () {
  it('considers "int" to be int', function () {
    const task = new Replacer({ env: 'int' })
    assert.equal(task.isEnv('int'), true)
    assert.equal(task.isEnv('demo'), false)
    assert.equal(task.isEnv('prod'), false)
  })
  it('considers "dev" to be int', function () {
    const task = new Replacer({ env: 'dev' })
    assert.equal(task.isEnv('int'), true)
    assert.equal(task.isEnv('demo'), false)
    assert.equal(task.isEnv('prod'), false)
  })
  it('considers "development" to be int', function () {
    const task = new Replacer({ env: 'development' })
    assert.equal(task.isEnv('int'), true)
    assert.equal(task.isEnv('demo'), false)
    assert.equal(task.isEnv('prod'), false)
  })
  it('considers "demo" to be demo', function () {
    const task = new Replacer({ env: 'demo' })
    assert.equal(task.isEnv('int'), false)
    assert.equal(task.isEnv('demo'), true)
    assert.equal(task.isEnv('prod'), false)
  })
  it('returns false for an env not in the map', function () {
    const task = new Replacer({ env: 'no-env' })
    assert.equal(task.isEnv('int'), false)
    assert.equal(task.isEnv('demo'), false)
    assert.equal(task.isEnv('prod'), false)
  })
})

// ---------------------------------------- | replaceCompAttrs()

describe('replaceCompAttrs()', function () {
  beforeEach(function () {
    initTmpFile()
  })

  after(function () {
    rmTmpFile()
  })

  it('does nothing for int', function () {
    const task = new Replacer({ env: 'int', file: tmpFilePath })
    const result = task.replaceCompAttrs()
    assert.equal(result, false)
    assert.equal(checkFileForAttrs('int'), true)
    assert.equal(checkFileForAttrs('demo'), false)
    assert.equal(checkFileForAttrs('prod'), false)
  })
  it('replaces demo values', function () {
    const task = new Replacer({ env: 'demo', file: tmpFilePath })
    const result = task.replaceCompAttrs()
    assert.notEqual(result, false)
    assert.equal(checkFileForAttrs('int'), false)
    assert.equal(checkFileForAttrs('demo'), true)
    assert.equal(checkFileForAttrs('prod'), false)
  })
  it('replaces prod values', function () {
    const task = new Replacer({ env: 'prod', file: tmpFilePath })
    const result = task.replaceCompAttrs()
    assert.notEqual(result, false)
    assert.equal(checkFileForAttrs('int'), false)
    assert.equal(checkFileForAttrs('demo'), false)
    assert.equal(checkFileForAttrs('prod'), true)
  })
  it('does nothing for a blank env', function () {
    const task = new Replacer({ env: '', file: tmpFilePath })
    const result = task.replaceCompAttrs()
    assert.equal(result, false)
    assert.equal(checkFileForAttrs('int'), true)
    assert.equal(checkFileForAttrs('demo'), false)
    assert.equal(checkFileForAttrs('prod'), false)
  })
  it('does nothing for an unexpected env', function () {
    const task = new Replacer({ env: 'wrong', file: tmpFilePath })
    const result = task.replaceCompAttrs()
    assert.equal(result, false)
    assert.equal(checkFileForAttrs('int'), true)
    assert.equal(checkFileForAttrs('demo'), false)
    assert.equal(checkFileForAttrs('prod'), false)
  })
})

// ---------------------------------------- | replaceCompLib()

describe('replaceCompLib()', function () {
  beforeEach(function () {
    initTmpFile()
  })

  after(function () {
    rmTmpFile()
  })

  it('does nothing for int', function () {
    const task = new Replacer({ env: 'int', file: tmpFilePath })
    const result = task.replaceCompLib()
    assert.equal(result, false)
    assert.equal(checkFileForLib('int'), true)
    assert.equal(checkFileForLib('demo'), false)
    assert.equal(checkFileForLib('prod'), false)
  })

  it('replaces demo value', function () {
    const task = new Replacer({ env: 'demo', file: tmpFilePath })
    const result = task.replaceCompLib()
    assert.notEqual(result, false)
    assert.equal(checkFileForLib('int'), false)
    assert.equal(checkFileForLib('demo'), true)
    assert.equal(checkFileForLib('prod'), false)
  })
  it('replaces prod value', function () {
    const task = new Replacer({ env: 'prod', file: tmpFilePath })
    const result = task.replaceCompLib()
    assert.notEqual(result, false)
    assert.equal(checkFileForLib('int'), false)
    assert.equal(checkFileForLib('demo'), false)
    assert.equal(checkFileForLib('prod'), true)
  })
  it('does nothing for a blank env', function () {
    const task = new Replacer({ env: '', file: tmpFilePath })
    const result = task.replaceCompLib()
    assert.equal(result, false)
    assert.equal(checkFileForLib('int'), true)
    assert.equal(checkFileForLib('demo'), false)
    assert.equal(checkFileForLib('prod'), false)
  })
  it('does nothing for an unexpected env', function () {
    const task = new Replacer({ env: 'wrong', file: tmpFilePath })
    const result = task.replaceCompLib()
    assert.equal(result, false)
    assert.equal(checkFileForLib('int'), true)
    assert.equal(checkFileForLib('demo'), false)
    assert.equal(checkFileForLib('prod'), false)
  })

  it('supports custom find/replace strings', function () {
    const replace = 'ever thus to deadbeats'
    const options = {
      env: 'other',
      file: tmpFilePath,
      find: 'components-int.crossroads.net',
      replace: replace,
    }

    new Replacer(options).replaceCompLib()
    const content = fs.readFileSync(tmpFilePath, { encoding: 'utf8' })
    const match = content.match(new RegExp(replace, 'g'))
    assert.equal((match && match.length == 1), true)
  })
})
