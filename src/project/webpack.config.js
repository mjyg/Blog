const argv = require("yargs-parser")(process.argv.slice(2))
const _mode = argv.mode || "development"
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const merge = require('webpack-merge')
const {resolve} = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = {
  entry: {
    app:resolve("./src/web/index.tsx")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/assets/test.html'
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
}