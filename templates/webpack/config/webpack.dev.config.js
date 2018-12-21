const path = require('path');
const webpackBaseConfig = require('./webpack.base.config.js');
const utils = require('./util.js');

const {
  webpackConfig,
  proxyTarget,
  devDirectory = 'dev',
  projectGroup,
  projectName
} = require('../project.config.js');
const merge = require('webpack-merge');

module.exports = (env, argv) => {
  argv.mode = "development"
  return merge(
    webpackBaseConfig, {
      mode: "development",
      devtool: "source-map",
      output: {
        path: path.resolve(__dirname, `../${devDirectory}`),
        publicPath: `html/${projectGroup}/${projectName}/`
      },
      module: {
        rules: [
          {
            test: /\.less$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'postcss-loader',
              'less-loader'
            ],
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'postcss-loader'
            ],
            // exclude: /node_modules/
          },
          {
            test: /\.(gif|jpg|png|svg)\??.*$/,
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      devServer: {
        port: 8080,
        host: "localhost",
        inline: true,
        https: {
          spdy: {
            protocols: ['http/1.1']
          }
        },
        hotOnly: true,
        openPage: "/XV/Home",
        disableHostCheck: true, // That solved `Invalid Host header` error
        headers: {
          "Access-Control-Allow-Origin": "*"
        },

        proxy: {
          '**': {
            target: proxyTarget,
            secure: false,
            changeOrigin: false,
            withCredentials: true,
            bypass: function (req, res, proxyOptions) {
              console.log(req.url);
              if (~req.url.indexOf('hot-update')) {
                return req.url.replace('/XV/Home', '');
              }
            }
          }
        }
      },
    }, utils.result({ webpackConfig }, 'webpackConfig', [env, argv]));
}
