const path = require('path')
const { readFile } = require('fs')
const { execFile } = require('child_process')
const { getOptions } = require('loader-utils')
const bsb = require.resolve('bs-platform/bin/bsb')

const outputDir = 'lib'

const getJsFile = (moduleDir, resourcePath) => {
  const mlFileName = resourcePath.replace(process.cwd(), '')
  const jsFileName = mlFileName.replace(/\.(ml|re)$/, '.js')
  return path.join(process.cwd(), outputDir, moduleDir, jsFileName)
}

const transformSrc = (moduleDir, src) =>
  moduleDir === 'es6' ?
  src.replace(/(from\ "\.\.?\/.*)(\.js)("\;)/g, '$1$3') :
  src.replace(/(require\("\.\.?\/.*)(\.js)("\);)/g, '$1$3')

const runBsb = callback => {
  execFile(bsb, ['-make-world'], callback)
}

const getCompiledFile = (moduleDir, path, callback, emitWarning) => {
  runBsb((err, res) => {
    if (err) {
      if (emitWarning) emitWarning(res)
      else return callback(err, res)
    }

    readFile(path, (err, res) => {
      if (err) {
        callback(err, err)
      } else {
        const src = transformSrc(moduleDir, res.toString())
        callback(null, src)
      }
    })
  })
}

module.exports = function () {
  const options = getOptions(this) || {}
  const errorType = options.errorType || 'error'
  const moduleDir = options.module || 'js'

  this.addDependency(this.resourcePath + 'i')
  const callback = this.async()
  const compiledFilePath = getJsFile(moduleDir, this.resourcePath)

  getCompiledFile(moduleDir, compiledFilePath, (err, res) => {
    if (err) {
      this.emitError(res)
      callback(err, null)
    } else {
      callback(null, res)
    }
  }, errorType === 'warning' ? this.emitWarning : null)
}
