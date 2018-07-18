const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    dll: [
      'vue/dist/vue.min.js',
      'quill/dist/quill.min.js',
      'cropperjs/dist/cropper.min.js',
      'lodash',
      'jszip'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static/dll'),
    filename: '[name]_[chunkhash].js',
    library: '[name]_[chunkhash]'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dll'], {
      root: path.resolve(__dirname, '../static/')
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../static/dll', '[name]-manifest.json'),
      libraryTarget: 'commonjs2',
      name: '[name]_[chunkhash]'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
