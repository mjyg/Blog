# webpack4源码分析
**目录**
> * [webpack启动文件](#webpack启动文件)
> * [webpack-cli入口文件cli](#webpack-cli入口文件cli)
> * [webpack加载入口文件](#webpack加载入口文件)
> * [webpack编译器Compiler](#webpack编译器Compiler)
> * [webpack的核心依赖模块tapable](#webpack的核心依赖模块tapable)

## webpack启动文件
当通过`nom run webpack`命令启动webpack时，会使用node去执行node_modules\.bin里面的webpack.js,这是
启动webpack的入口文件，该文件是webpack包里bin目录下的webpack.js的软链接<br>
>📚 通过在package.json提供一个映射到本地本地文件名的bin字段,一旦被引入后,npm将软链接这个文件到prefix/bin里面,
>以便于全局引入,或者在./node_modules/.bin/目录里,webpack里的package.json里的bin为`./bin/webpack.js`，
>可以找到其入口文件为webpack里的bin目录下的webpack.js

webpack.js内容如下：
```js
process.exitCode = 0;  //1
const runCommand = (command, args) =>{...};//2
const isInstalled = packageName =>{...};//3
const CLIs =[...];//4
const installedClis = CLIs.filter(cli => cli.installed); //5
if (installedClis.length === 0){...}else if (installedClis.length === 1){...}else{...}//6
```
这个文件里代码可以分为6步，分别说明如下：
* 1：nodejs中表示执行成功，回调函数的err 将为null；
* 2：建一个shell，然后在shell里执行命令
* 3：一个用来判断某个包是否安装的函数，利用了 require.resolve() 函数来检查包的路径是否存在
* 4：一个用来存储webpack的cli工具信息的数组，实际上只包含两个：webpack-cli 与 webpack-conmand;
* 5：一个用来存储已安装的webpack的cli工具信息的数组；
* 6.：根据已安装的webpack命令行工具数量做不同的逻辑处理；

<br>先看CLIs存放的数据：
```js
const CLIs = [
  {
    name: "webpack-cli",
    package: "webpack-cli",
    binName: "webpack-cli",
    alias: "cli",
    installed: isInstalled("webpack-cli"),
    recommended: true,
    url: "https://github.com/webpack/webpack-cli",
    description: "The original webpack full-featured CLI.",
  },
  {
    name: "webpack-command",
    package: "webpack-command",
    binName: "webpack-command",
    alias: "command",
    installed: isInstalled("webpack-command"),
    recommended: false,
    url: "https://github.com/webpack-contrib/webpack-command",
    description: "A lightweight, opinionated webpack CLI.",
  },
];
```
可以看到，该数组中定义了两个对象，分别是webpack-cli 和 webpack-command 两个cli工具包的详细信息。
这两个对象都有一个名为installed的属性，使用了第3步所定义的方法检查了该依赖包是否已安装，如果检查结果为已
安装，则会被filter()方法放到新生成的installedClis数组中。
再看剩下的代码：
```js
//webpack-cli和webpack-command都没安装
if (installedClis.length === 0) {
  const path = require("path");
  const fs = require("fs");
  const readLine = require("readline");

  //命令行输出信息的字符串定义
  let notify =
    "One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:";

  //遍历CLIS数组，如果该cli工具是被推荐的，则输出相关信息
  for (const item of CLIs) {
    if (item.recommended) {
      notify += `\n - ${item.name} (${item.url})\n   ${item.description}`;
    }
  }

  console.error(notify);

  //判断包管理工具，有yarn.lock文件，就使用yarn，否则使用npm
  const isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

  //根据不同的包管理工具推荐不同的包安装命令
  const packageManager = isYarn ? "yarn" : "npm";
  const installOptions = [isYarn ? "add" : "install", "-D"];

  console.error(
    `We will use "${packageManager}" to install the CLI via "${packageManager} ${installOptions.join(
      " "
    )}".`
  );

  //询问是否安装webpack-cli
  const question = `Do you want to install 'webpack-cli' (yes/no): `;

  // 根据用户回答结果，如果是yes，则自动安装，如果为no，则提示错误信息，并退出执行；如果安装出错，输出错误信息并退出执
  //行；如果安装成功，则引入webpack-cli 包并执行它
  const questionInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  questionInterface.question(question, (answer) => {
    questionInterface.close();

    const normalizedAnswer = answer.toLowerCase().startsWith("y");

    if (!normalizedAnswer) {
      console.error(
        "You need to install 'webpack-cli' to use webpack via CLI.\n" +
          "You can also install the CLI manually."
      );
      process.exitCode = 1;

      return;
    }

    const packageName = "webpack-cli";

    console.log(
      `Installing '${packageName}' (running '${packageManager} ${installOptions.join(
        " "
      )} ${packageName}')...`
    );

    //执行yarn add webpack-cli
    runCommand(packageManager, installOptions.concat(packageName))
      .then(() => {
        require(packageName); //eslint-disable-line
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  });
} else if (installedClis.length === 1) {
  //如果安装了其中一个cli工具，这里假定安装webpack-cli
  const path = require("path");
  const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
  console.log("pkgPath", pkgPath); //.../node_modules/_webpack-cli@3.3.12@webpack-cli/package.json
  // eslint-disable-next-line node/no-missing-require
  const pkg = require(pkgPath);
  // eslint-disable-next-line node/no-missing-require
  //找到webpack-cli里的package.json里的"bin": { "webpack-cli": "./bin/cli.js" }，再找到./bin/cli.js
  require(path.resolve(
    path.dirname(pkgPath),
    pkg.bin[installedClis[0].binName]
  ));
  console.log(
    path.resolve(path.dirname(pkgPath), pkg.bin[installedClis[0].binName])
  ); //...node_modules/_webpack-cli@3.3.12@webpack-cli/bin/cli.js,
} else {
  //两个cli工具都安装了则提示你需要删除一个
  console.warn(
    `You have installed ${installedClis
      .map((item) => item.name)
      .join(
        " and "
      )} together. To work with the "webpack" command you need only one CLI package, please remove one of them or use them directly via their binary.`
  );

  // @ts-ignore
  process.exitCode = 1; //退出Node.js的shell
}
```
## webpack-cli入口文件cli
上面再webpack.js中调用了webpack-cli的的入口文件cli.js,下面是它的基本结构：
```js
(function (){
	const importLocal = require("import-local"); //1
	if (importLocal(__filename)){...}//2
	require("v8-compile-cache"); //3
	const ErrorHelpers = require("./errorHelpers"); // 4
	const NON_COMPILATION_ARGS = []; //5
	const NON_COMPILATION_CMD = process.argv.find(arg=>{...})//6
	if (NON_COMPILATION_CMD){...}//7
	const yargs = require("yargs").usage(...);//8
	require("./config-yargs")(yargs);//9
	const DISPLAY_GROUP = "Stats options:";//10
	const BASIC_GROUP = "Basic options:";//11
	yargs.options({...}) //12
	yargs.parse(process.argv.slice(2), (err, argv, output) => {...}); //13
})();
```
我们可以看出这是一个立即执行函数。其中分为了以下步骤：
* 1： 引入了import-local 包，这个包的作用在于判断某个包是本地安装的还是全局安装的；
* 2：判断当前包（webpack-cli）是否全局安装，如果是全局安装，则中断执行。【意思是要求必须是项目本地安装】
* 3：引入V8引擎的代码缓存功能，用于加速实例化。
* 4：引入错误处理类
* 5：定义了NON_COMPILATION_ARGS 数组，该数组存储了一些不需要编译的参数
* 6：生成了NON_COMPILATION_CMD 数组，该数组存储了一些不需要编译的命令
* 7：如果NON_COMPILATION_CMD 数组不为空，则直接执行这些命令
* 8：使用yargs 包来生成一个更加优雅的交互式命令行界面
* 9：对yargs命令行进行一些配置
* 10：定义 DISPLAY_GROUP 变量；
* 11：定义 BASIC_GROUP 变量；
* 12：对yargs命令行进行进一步的配置；
* 13：使用yargs 解析并执行命令行参数；

不做过多分析，在整个文件中关键部分代码是以下部分：
```js
//执行webpack
const webpack = require("webpack");

let lastHash = null;
let compiler;
try {
  console.log('options',options)
// options {
//   plugins: [ ConsoleLogOnBuildWebpackPlugin {} ],
//   mode: 'development',
//   context: '/Users/jie/Desktop/project/git/Learn/8.17webpack/webpack4'
// }

    compiler = webpack(options); //执行webpack函数，compiler是整个webpack编译的核心
```
找到webpack里Package.json里的main属性，值为'lib/webpack.js'，接下来看webpack的加载入口文件
'lib/webpack.js'。

## webpack加载入口文件
先在demo中加入一个自己的plugin来分析后面的代码，创建/plugin/ConsoleLogOnBuildWebpackPlugin.js,
这是一个webpack编译前可以想控制台输出信息的插件,在官网中可以找到它的代码如下
```js
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
```
在webpack.config.js中引入该插件：
```js
const ConsoleLogOnBuildWebpackPlugin = require('./plugin/ConsoleLogOnBuildWebpackPlugin')
module.exports={
  plugins: [new ConsoleLogOnBuildWebpackPlugin()]
}
```
然后运行webpack编译命令，打印webpack.js中的参数，分析开头部分如下：
```js
// options {
//   plugins: [ ConsoleLogOnBuildWebpackPlugin {} ],
//   mode: 'development',
//   context: '/Users/jie/Desktop/project/git/Learn/8.17webpack/webpack4'
// }
const webpack = (options, callback) => {
  const webpackOptionsValidationErrors = validateSchema(
    webpackOptionsSchema,
    options
  );
  if (webpackOptionsValidationErrors.length) {
    throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
  }
  let compiler;
  if (Array.isArray(options)) {
    compiler = new MultiCompiler(
      Array.from(options).map((options) => webpack(options))
    );
  } else if (typeof options === "object") {
    options = new WebpackOptionsDefaulter().process(options);

    compiler = new Compiler(options.context);
    compiler.options = options;
    new NodeEnvironmentPlugin({
      infrastructureLogging: options.infrastructureLogging,
    }).apply(compiler);
    //关键代码
    if (options.plugins && Array.isArray(options.plugins)) {
      for (const plugin of options.plugins) {
        console.log('typeof plugin', typeof plugin)  //object  说明是new Class(),已经是实例化对象了
        if (typeof plugin === "function") {
          plugin.call(compiler, compiler);
        } else {
          plugin.apply(compiler); //调用插件的apply方法，传入complier
        }
      }
```
可看出关键部分代码是调用插件的apply方法，传入complier对象，下面分析webpack编译器Compiler.js

## webpack编译器Compiler
由ConsoleLogOnBuildWebpackPlugin插件里的代码可知，调用的是compiler.hooks.run.tap方法，我们在Compiler
的开始找到下面这部分代码：
```js
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      /** @type {SyncBailHook<Compilation>} */
      shouldEmit: new SyncBailHook(["compilation"]),
      /** @type {AsyncSeriesHook<Stats>} */
      done: new AsyncSeriesHook(["stats"]),
      /** @type {AsyncSeriesHook<>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<Compiler>} */
      beforeRun: new AsyncSeriesHook(["compiler"]),
      /** @type {AsyncSeriesHook<Compiler>} */
      run: new AsyncSeriesHook(["compiler"]),
```
在最后一行，发现compiler.hooks.run是AsyncSeriesHook实例，AsyncSeriesHook.js位于tapable模块，它是
独立于webpack的另一个依赖包，我们可以看到Compiler也继承自Tapable，那它到底是什么呢？

## webpack的核心依赖模块tapable
tapable是webpack的核心依赖模块，简而言之，就是一个注册钩子函数的模块。<br>
我们知道，webpack之所以强大，靠的就是丰富的插件系统，不管你有什么需求，总有插件能满足你。而这些插件能够
按照你配置的方式工作，全部依赖于tapable模块，它将这些插件注册为一个个钩子函数，然后按照插件注册时告知的
方式，在合适的时机安排它们运行，最终完成整个打包任务。
接下来用一个小demo来简要看下tapable，创建tapable-demo，如下：
```js
const {
  Tapable, //同步串行,不关心监听返回值
  SyncHook, //同步串行，只要监听函数有一个返回不为null,跳过剩下的
  SyncBailHook, //同步串行，上一个监听函数可以返回给下一个
  AsyncParallelHook,//同步循环，如果有一个函数返回true,反复执行
  AsyncSeriesHook  //异步并发
} = require("tapable");

let queue = new SyncHook(['name'])
queue.tap('1',function(){
  console.log('⏫第一个订阅')
})
queue.tap('2',function(){
  console.log('⏫第二个订阅')
})
queue.tap('3',function(){
  console.log('⏫第三个订阅')
})
queue.call() //第一个订阅 第二个订阅 第三个订阅
```
执行tapable-demo，依次输出'第一个订阅 第二个订阅 第三个订阅'<br>

📚 本文demo见[webpack4 demo](./demo/webpack4)

🌺 参考文章：
>* [package.json bin的作用](https://blog.csdn.net/feng98ren/article/details/93729399)
>* [webpack4 源码分析(一) 入口及webpack.js](https://blog.csdn.net/hjb2722404/article/details/89384477)
