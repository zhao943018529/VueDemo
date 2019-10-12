const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {    
  entry: './src/main.js',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode:'development',
  module:{
      rules:[
          {
              test: /\.vue$/,
              use: [
                  {
                      loader: 'vue-loader'
                  }
              ]
          },
          {
              test: /\.js$/,
              use: ['babel-loader']
          },
          {
              test: /\.(sa|sc|c)ss$/,
              use: [
                  {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                          publicPath: './dist',
                          hmr: false,
                          reloadAll: true
                      },
                  },
                  'css-loader',
                  'postcss-loader',
                  'sass-loader'
              ]
          }
      ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    }
  },
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({   // 生产环境压缩JS
        cache: true,    //是否否启用缓存
        parallel: true,   //多通道并行处理
        sourceMap: false, //生产环境关闭源码映射
        uglifyOptions: {
          warnings: false,    //清除警告
          compress:{
            drop_debugger: true,	// 清除degugger
            drop_console: true   //清除所有的console信息
          }
        }
      }),
      //new OptimizeCssAssetsPlugin()   // 生产环境压缩css
    ],
    splitChunks: {   //用于拆分代码，找到 chunk 中共同依赖的模块进行“提取”和“分离”到单独的文件中，减少打包后体积，可以避免内存溢出的问题。
      chunks: 'all'
    }
  },
  plugins:[
      new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt'),
      new MiniCssExtractPlugin({
          filename: './css/[name].css',
          chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
          title:"VueDemo",
          template:'./src/index.html'
      }),
      new copyWebpackPlugin([{
        from: __dirname + '/src/images',
        to: __dirname + '/dist/images'
      }]),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin()
  ],
  devServer:{
    contentBase: './dist',
    port: 8080,
    hot: true,
    hotOnly: true,
    proxy: {
        "/agents": "http://localhost:3001",
    },
    historyApiFallback: true,
  }
};