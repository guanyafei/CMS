'use strict'
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MultiPagesWebPlugin = require('./lib/MultiPagesWebPlugin')
const packageConfig = require('../package.json')
const dllManifest = JSON.parse(
  fs.readFileSync(resolve('static/dll/dll-manifest.json'))
)
const multiPagesWebPlugin = new MultiPagesWebPlugin(resolve('src/pages'), {
  template: path.resolve(__dirname, 'template.ejs'), // HTML 模版文件所在的文件路径
  // 提取出所有页面公共的代码
  templateCompiler: function(pageName, templateFullPath) {
    const ejsTemplate = fs.readFileSync(templateFullPath, {
      encoding: 'utf8'
    })
    return ejs.render(ejsTemplate, {
      title: pageName,
      dllName: dllManifest.name,
      filename: './template.ejs'
    })
  },
  // 提取出所有页面公共的代码
  commonsChunk: [
    {
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    },
    {
      name: 'manifest',
      minChunks: Infinity
    },
    {
      name: 'base',
      isPagesChunks: true,
      minChunks: 3
    }
  ]
})
exports.autoWebPlugin = multiPagesWebPlugin

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
exports.resolve = resolve

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}


