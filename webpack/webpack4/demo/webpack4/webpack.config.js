const ConsoleLogOnBuildWebpackPlugin = require('./plugin/ConsoleLogOnBuildWebpackPlugin')
const path = require('path')

module.exports={
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: path.resolve('./loader/babel-loader.js'),  //引用自己写的loader
          options: {
            data:'🍌自定义配置项'
          }
        }
      }
    ]
  },
  plugins: [new ConsoleLogOnBuildWebpackPlugin()]
}