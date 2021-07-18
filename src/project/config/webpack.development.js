const {join} = require('path')
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');


module.exports = {
  devServer:{
    contentBase:join(__dirname, "../dist"),
    hot:true,
    quiet:true,
    historyApiFallback:true,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:3000'],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: function (severity, errors) {
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warning'
      },
      clearConsole:true
    }),
    new WebpackBuildNotifierPlugin({
      title: "My Webpack Project",
      suppressSuccess: true, // don't spam success notifications
    })
  ],
}