const url = require('url')
const { AutoWebPlugin, WebPlugin } = require('web-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const util = require('./util')

class MultiPagesWebPlugin extends AutoWebPlugin {
  // call by webpack
  apply(compiler) {
    global._isProduction = util.isProduction(compiler)
    global._isExtractStyle = util.isExtractStyle(compiler)
    const { options: compilerOptions } = compiler
    const { entryMap } = this
    const {
      commonsChunk,
      stylePublicPath,
      outputPagemap,
      htmlMinify
    } = this.options

    const useCommonsChunk =
      commonsChunk !== null && typeof commonsChunk === 'object'
    const isMultiChunk = commonsChunk !== null && Array.isArray(commonsChunk)
    let commonsChunkNames = []
    if (useCommonsChunk) {
      if (isMultiChunk) {
        commonsChunk.forEach(item => {
          commonsChunkNames.push(item.name)
        })
      } else {
        commonsChunkNames.push(commonsChunk.name)
      }
    }
    Object.keys(entryMap).forEach(pageName => {
      // ensure entryMap from pages has been add to webpack entry
      // webpack-dev-server may modify compilerOptions.entry, e.g add webpack-dev-server/client to every entry
      compilerOptions.entry = Object.assign(
        this.webpackEntry,
        compilerOptions.entry
      )

      // add an WebPlugin for every page to output an html
      const { templatePath, templateCompiler } = entryMap[pageName]

      new WebPlugin({
        template: templatePath,
        templateCompiler,
        pageName,
        filename: `${pageName}.html`,
        requires: useCommonsChunk
          ? commonsChunkNames.concat(pageName)
          : [pageName],
        stylePublicPath,
        htmlMinify
      }).apply(compiler)
    })

    if (useCommonsChunk) {
      const commonsChunkPluginOption = {
        // get all pages's commons chunk
        // chunks: Object.keys(entryMap)
      }
      if (isMultiChunk) {
        commonsChunk.forEach(item => {
          Object.assign(commonsChunkPluginOption, item)
          if (item.isPagesChunks) {
            commonsChunkPluginOption.chunks = Object.keys(entryMap)
            delete item.isPagesChunks
          }
          new CommonsChunkPlugin(commonsChunkPluginOption).apply(compiler)
        })
      } else {
        Object.assign(commonsChunkPluginOption, commonsChunk)
        new CommonsChunkPlugin(commonsChunkPluginOption).apply(compiler)
      }
    }

    // logic for pagemap.json
    compiler.plugin('emit', (compilation, callback) => {
      if (outputPagemap) {
        const publicPath = util.getPublicPath(compilation)
        const outJson = {}
        Object.keys(this.entryMap).forEach(name => {
          outJson[name] = url.resolve(
            publicPath,
            `${this.entryMap[name].htmlOutputFilename}.html`
          )
        })
        util.addFileToWebpackOutput(
          compilation,
          'pagemap.json',
          JSON.stringify(outJson)
        )
      }
      callback()
    })
  }
}

module.exports = MultiPagesWebPlugin
