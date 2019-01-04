/**
 * 公共配置
 */
const path = require('path');
const webpack = require('webpack');
const {
  VueLoaderPlugin
} = require('vue-loader');
const TransferToCmdPlugin = require('webpack-transfer-cmd-plugin');
const RuntimePublicPathPlugin = require("webpack-runtime-public-path-plugin")
const {
  projectGroup,
  projectName,
  runtimePublicPath
} = require('../project.config.js');

const _projectGroup = projectGroup ? projectGroup + '_' : '';

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../'),
  output: {
    filename: '[name].js',
    chunkFilename: 'chunk-[name].js',
    libraryTarget: 'commonjs2',
    library: `${_projectGroup + projectName}`
  },
  // 加载器
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(woff|eot|ttf)\??.*$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  plugins: [
    new RuntimePublicPathPlugin({
      runtimePublicPath: runtimePublicPath ?
        `${runtimePublicPath}` : 
        `FS.${_projectGroup ? _projectGroup.toLocaleUpperCase() : ''}${projectName.toLocaleUpperCase()}_MODULE.ROOT_PATH + "/"`
    }),
    new webpack.DefinePlugin({
      seajsRequire: 'require'
    }),
    new VueLoaderPlugin(),
    new TransferToCmdPlugin()
  ]
};
