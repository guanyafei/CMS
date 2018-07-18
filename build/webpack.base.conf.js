'use strict'
const path = require('path')
const os = require('os')
const chalk = require('chalk')
const HappyPack = require('happypack')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
const utils = require('./utils')
const config = require('../config')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const resolve = utils.resolve


function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool
  })
}
module.exports = {
  context: path.resolve(__dirname, '../'),
  // AutoWebPlugin 会找为寻找到的所有单页应用，生成对应的入口配置，
  // autoWebPlugin.entry 方法可以获取到生成入口配置
  entry: utils.autoWebPlugin.entry({
    // 这里可以加入你额外需要的 Chunk 入口
    /* vendor: ['vue', 'loadsh', 'cropperjs'] */
  }),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      cropperjs: 'cropperjs/dist/cropper.min.js',
      vue$: 'vue/dist/vue.min.js',
      src: resolve('src'),
      assets: resolve('src/assets'),
      routers: resolve('src/routers'),
      js: resolve('src/js'),
      interface: resolve('src/interface'),
      views: resolve('src/views'),
      maps: resolve('src/maps'),
      utils: resolve('src/utils'),
      mixins: resolve('src/mixins'),
      directives: resolve('src/directives'),
      components: resolve('src/components'),
      widgets: resolve('src/views/widgets')
    },
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [resolve('node_modules')],
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happy-babel-js',
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    }),
    new DllReferencePlugin({
      context: path.resolve(__dirname, '..'),
      manifest: require(resolve('static/dll/dll-manifest.json'))
    }),
    createHappyPlugin('happy-babel-js', ['babel-loader'])
  ]
};
