const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpackBaseConfig = require('./webpack.base.config.js');
const utils = require('./util.js');
const {
  webpackConfig, prodDirectory = 'build',
  projectGroup, projectName, moduleSeparator
} = require('../project.config.js');
const TplConfigPlugin = require('webpack-tplconfig-plugin');


function recursiveIssuer(m, entry_name) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else{
    for (var chunk of m._chunks) {
      if(entry_name == chunk.name)
        return chunk.name;
    }
    return false;
  }
}

function getCacheGroups(entries) {
  let groups = {};
  for(let key in entries){
    groups[`${key}Style`] = {
      name: key,
      test: (m,c,entry = key) => m.constructor.name === 'CssModule' && recursiveIssuer(m, entry) === entry,
      enforce: true,
      reuseExistingChunk: true
    };
  }
  return groups;
}

module.exports = (env, argv) => {
  argv.mode = "production";
  let webpack_config = utils.result({ webpackConfig }, 'webpackConfig', [env, argv]);
  return merge(webpackBaseConfig, {
    mode: 'production',
    devtool: 'none',
    output: {
      filename: '[name].[chunkHash:8].js',
      chunkFilename: '[name].[chunkHash:8].js',
      path: path.resolve(__dirname, `../${prodDirectory}`)
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader'
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ],
          exclude: /node_modules/
        },
        {
          test: /\.(gif|jpg|png|svg)\??.*$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: 'images/[name].[ext]'
              }
            },
            // {
            //   loader: 'image-webpack-loader',
            //   options: {
            //     mozjpeg: {
            //       progressive: true,
            //       quality: 65
            //     },
            //     optipng: {
            //       enabled: false,
            //     },
            //     pngquant: {
            //       quality: '65-90',
            //       speed: 4
            //     },
            //     gifsicle: {
            //       interlaced: false,
            //     },
            //     webp: {
            //       quality: 75
            //     }
            //   }
            // }
          ]
        },
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            mangle: { reserved: ['require', 'exports', 'module'] },
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCssAssetsPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        minChunks: 3,
        cacheGroups: getCacheGroups(webpack_config.entry)
      }
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       chunks: "all",
      //       minChunks: 2,
      //       name: 'vendor',
      //       enforce: true,
      //       reuseExistingChunk: true
      //     },
      //   },
      // }
      // runtimeChunk: 'single'
    },
    plugins: [
      new CleanWebpackPlugin(['build'], {
        root: path.resolve(__dirname, '../')
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css"
      }),
      new ManifestPlugin({
        generate(seed, files) {
          return files.reduce(function (manifest, {name, path, isInitial}) {
            if(isInitial){
              let key = name.replace(/\.[A-Za-z]+$/, '');
              if(/\.css$/.test(name))     //处理css
                key = `css-${key}`;
              manifest[key] = path;
            }
            return manifest;
          }, seed);
        }
      }),
      new TplConfigPlugin({
        prefix: projectGroup + moduleSeparator + projectName + moduleSeparator
      })
    ]
  }, webpack_config);
}
