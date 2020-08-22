//自定义plugin
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  //A webpack plugin is a JavaScript object that has an apply method. This apply method is
  // called by the webpack compiler, giving access to the entire compilation lifecycle.
  apply(compiler) {
    //webpack刚开始运行时
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('🍊🍊🍊The webpack build process is starting!!!');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;