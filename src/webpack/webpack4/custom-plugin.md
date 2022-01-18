# 自定义plugin

## 第一个例子:webpack编译时输出“hello world”
```js
function CustomWebpackPlugin1 (options) {
  this.options = options
}
CustomWebpackPlugin1.prototype.apply = function (compiler) {
  compiler.hooks.done.tap('No1', () => {
    console.log(this.options.msg)
  })
}
module.exports = CustomWebpackPlugin1;
```
使用No1WebpackPlugin（这里用的umi框架）：
```js
const CustomWebpackPlugin1 = require('../plugins/custom-webpack-plugin1')
config.plugin('custom-webpack-plugin1').use(CustomWebpackPlugin1, [{msg:'hello world'}])
```
可以看到输出了"hello world":

![](../image/1642516838(1).png)



让我们来拆分一下`compiler.hooks.done.tap('No1', () => {})`：

- `compiler`：一个扩展至`Tapable`的对象
- `compiler.hooks`：`compiler`对象上的一个属性，允许我们使用不同的钩子函数
- `.done`：`hooks`中常用的一种钩子，表示在一次编译完成后执行，它有一个回调参数`stats`(暂时没用上)
- `.tap`：表示可以注册同步的钩子和异步的钩子，而在此处因为`done`属于异步`AsyncSeriesHook`类型的钩子，所以这里表示的是注册`done`异步钩子。
- `.tap('No1')`：`tap()`的第一个参数`'No1'`，其实`tap()`这个方法它的第一个参数是可以允许接收一个**字符串**或者一个**Tap**类的对象的，不过在此处我们不深究，你先随便传一个字符串就行了，我把它理解为这次调用钩子的方法名。

所以让我们连起来理解这段代码的意思就是：

1. 在程序执行`new No1WebpackPlugin()`的时候，会初始化一个插件实例且调用其原型对象上的`apply`方法
2. 该方法会告诉`webpack`当你在一次编译完成之后，得执行一下我的箭头函数里的内容，也就是打印出`msg`

## Tapable

Tapable就是webpack用来创建钩子的库，为webpack提供了插件接口的支柱

它暴露了9个`Hooks`类，以及3种方法(`tap、tapAsync、tapPromise`)，可用于为插件创建钩子。

9种`Hooks`类与3种方法之间的关系：

- `Hooks`类表示的是你的钩子是哪一种类型的，比如我们上面用到的`done`，它就属于`AsyncSeriesHook`这个类
- `tap、tapAsync、tapPromise`这三个方法是用于注入不同类型的自定义构建行为，因为我们的钩子可能有同步的钩子，也可能有异步的钩子，而我们在注入钩子的时候就得选对这三种方法了。

`Hooks`类：

**Sync***

- SyncHook --> 同步串行钩子，不关心返回值
- SyncBailHook  --> 同步串行钩子，如果返回值不为null 则跳过之后的函数
- SyncLoopHook --> 同步循环，如果返回值为true 则继续执行，返回值为false则跳出循环
- SyncWaterfallHook --> 同步串行，上一个函数返回值会传给下一个监听函数

**Async***

- AsyncParallel*：异步并发
  - AsyncParallelBailHook -->  异步并发，只要监听函数的返回值不为 null，就会忽略后面的监听函数执行，直接跳跃到callAsync等触发函数绑定的回调函数，然后执行这个被绑定的回调函数
  - AsyncParallelHook --> 异步并发，不关心返回值
- AsyncSeries*：异步串行
  - AsyncSeriesHook --> 异步串行，不关心callback()的参数
  - AsyncSeriesBailHook --> 异步串行，callback()的参数不为null，就会忽略后续的函数，直接执行callAsync函数绑定的回调函数
  - AsyncSeriesWaterfallHook --> 异步串行，上一个函数的callback(err, data)的第二个参数会传给下一个监听函数

三种方法：

- `tap`：可以注册同步钩子也可以注册异步钩子
- `tapAsync`：回调方式注册异步钩子
- `tapPromise`：`Promise`方式注册异步钩子

## compile & compilation

这两个其实就是`Compiler`对象下的两个钩子了，也就是我们可以通过这样的方式来调用它们：

```
No1WebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No1', () => {
    console.log(this.options.msg)
  })
  compiler.hooks.compilation.tap('No1', () => {
    console.log(this.options.msg)
  })
}
复制代码
```

区别在于：

- `compile`：一个新的编译(compilation)创建之后，钩入(hook into) compiler。
- `compilation`：编译(compilation)创建之后，执行插件。

## 第二个例子：compile与compilation钩子的区别

```js
function CustomWebpackPlugin2 (options) {
  this.options = options
}
CustomWebpackPlugin1.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No1', () => {
    console.log('compile:', this.options.msg)
  })
  compiler.hooks.compilation.tap('No1', () => {
    console.log('compilation:',this.options.msg)
  })
}
module.exports = CustomWebpackPlugin2;

```

可以看到控制台先打印了一次"compile: hello world",打印了很多次"compilation: hello world"

![](../image/1642517158(1).png)

原因是最终生成的`dist`文件夹下会有几个文件，那么`compilation`这个钩子就被调用几次，而`compile`钩子就只被调用一次

## Compiler & Compilation

- `Compiler`：是一个对象，该对象代表了**完整的`webpack`环境配置**。整个`webpack`在构建的时候，会先**初始化参数**也就是从配置文件(`webpack.config.js`)和`Shell`语句(`"build": "webpack --mode development"`)中去读取与合并参数，之后**开始编译**，也就是将最终得到的参数初始化这个`Compiler`对象，然后再会加载所有配置的插件，执行该对象的`run()`方法开始执行编译。因此我们可以理解为它是`webpack`的支柱引擎。

  **Compiler 对象包含了 Webpack 环境所有的的配置信息**，包含 `options`，`hook`，`loaders`，`plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是**全局唯一**的，可以简单地把它理解为 `Webpack` 实例

- `Compilation`：也是一个对象，不过它表示的是**某一个模块**的资源、编译生成的资源、变化的文件等等，因为我们知道我们在使用`webpack`进行构建的时候可能是会生成很多不同的模块的，而它的颗粒度就是在每一个模块上。

  **Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等**。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创

所以你现在可以看到它俩的区别了，一个是代表了整个构建的过程，一个是代表构建过程中的某个模块。



`compiler.hooks.compilation`这个钩子，是能够接收一个参数的，这个参数就是一个**Compilation**

## 第三个例子：在compiler.hooks.compilation钩子里使用Compilation

使用一个compilation钩子chunkAsset

- 类型： `SyncHook`
- 触发的事件一个 chunk 中的一个资源被添加到编译中。
- 参数：`chunk filename`

```js
function CustomWebpackPlugin3 (options) {
  this.options = options
}
CustomWebpackPlugin1.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No1', () => {
    console.log('compile:', this.options.msg)
  })
  compiler.hooks.compilation.tap('No1', (compilation) => {
    compilation.hooks.chunkAsset.tap('No1',(chunk, filename)=>{
      console.log('chunk:', chunk)
      console.log('filename:', filename)
    })
  })
}
module.exports = CustomWebpackPlugin3;
```

* 在`Compiler`的`compilation`钩子函数中，获取到`Compilation`对象

* 之后对每一个`Compilation`对象调用它的`chunkAsset`钩子

* 根据文档我们发现`chunkAsset`钩子是一个`SyncHook`类型的钩子，所以只能用`tap`去调用

每个`Compilation`对象都对应着一个输出资源，可以看到控制台打印出了一长串信息。

## 第四个例子：自动产生一个打包文件清单

在每次`webpack`打包之后，自动产生一个打包文件清单，实际上就是一个`markdown`文件，上面记录了打包之后的文件夹`dist`里所有的文件的一些信息

使用compiler 钩子emit:

- 类型： `AsyncSeriesHook`
- 触发的事件：生成资源到 `output` 目录之前。
- 参数：`compilation`

```js
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 1.通过`compiler.hooks.emit.tapAsync()`来触发生成资源到`output`目录之前的钩子，且回调函数会
  // 有两个参数，一个是`compilation`，一个是`cb`回调函数
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
    // 2.要生成的`markdown`文件的名称
    const fileListName = this.filename;
    // 3.通过`compilation.assets`获取到所有待生成的文件，这里是获取它的长度
    let len = Object.keys(compilation.assets).length;
    // 4.定义`markdown`文件的内容，也就是先定义一个一级标题，`\n`表示的是换行符
    let content = `# 一共有${len}个文件\n\n`;
    // 5.将每一项文件的名称写入`markdown`文件内
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`
    }
    // 6.给我们即将生成的`dist`文件夹里添加一个新的资源，资源的名称就是`fileListName`变量
    compilation.assets[fileListName] = {
      // 7.写入资源的内容
      source: function () {
        return content;
      },
      // 8.指定新资源的大小，用于`webpack`展示
      size: function () {
        return content.length;
      }
    }
    // 9.由于我们使用的是`tapAsync`异步调用，所以必须执行一个回调函数`cb`，否则打包后就只会创建一个空的`dist`文件夹。
    cb();
  })
}
module.exports = FileListPlugin;

```

### 使用tapPromise重写

```js
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 第二种 Promise
  compiler.hooks.emit.tapPromise('FileListPlugin', compilation => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)  //改为1s后才输出资源
    }).then(() => {
      const fileListName = this.filename;
      let len = Object.keys(compilation.assets).length;
      let content = `# 一共有${len}个文件\n\n`;
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`;
      }
      compilation.assets[fileListName] = {
        source: function () {
          return content;
        },
        size: function () {
          return content.length;
        }
      }
    })
  })
}
module.exports = FileListPlugin;

```

可以看到它与第一种`tapAsync`写法的区别了：

- 回调函数中只需要一个参数`compilation`，不需要再调用一下`cb()`
- 返回的是一个`Promise`，这个`Promise`在`1s`后才`resolve()`。

另外，`tapPromise`还允许我们使用`async/await`的方式，比如这样：

```js
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 第三种 await/async
  compiler.hooks.emit.tapPromise('FileListPlugin', async (compilation) => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    const fileListName = this.filename;
    let len = Object.keys(compilation.assets).length;
    let content = `# 一共有${len}个文件\n\n`;
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`;
    }
    compilation.assets[fileListName] = {
      source: function () {
        return content;
      },
      size: function () {
        return content.length;
      }
    }
  })
}
module.exports = FileListPlugin;

```

## 第五个例子：监听资源改动

- 当项目在开启观察者`watch`模式的时候，监听每一次资源的改动
- 当每次资源变动了，将改动资源的个数以及改动资源的列表输出到控制台中
- 监听结束之后，在控制台输出`"本次监听停止了哟～"`

首先，在package.json的script加一条脚本命令：

```js
  "watch": "webpack --watch --mode development",
```

使用watchRun钩子：

- 类型：`AsyncSeriesHook`
- 触发的事件：监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
- 参数：`compiler`

针对第三点，监听结束之后，`watchClose`就可以了：

- 类型：`SyncHook`
- 触发的事件：监听模式停止。
- 参数：无

```js
function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    console.log('我可是时刻监听着的 🚀🚀🚀')
    // let mtimes = compiler.watchFileSystem.watcher.mtimes;
    // let mtimesKeys = Object.keys(mtimes);
    // if (mtimesKeys.length > 0) {
    //   console.log(`本次一共改动了${mtimesKeys.length}个文件,目录为:`)
    //   console.log(mtimesKeys)
    //   console.log('------------分割线-------------')
    // }
    const fileWatchers = compiler.watchFileSystem.watcher.fileWatchers;
    console.log(fileWatchers)
    //fileWatcher会把node_modules文件夹里的改变也算上，需要过滤一下
    let paths = fileWatchers.map(watcher => watcher.path).filter(path => !/(node_modules)/.test(path))
    
    if (paths.length > 0) {
      console.log(`本次一共改动了${paths.length}个文件,目录为:`)
      console.log(paths)
      console.log('------------分割线-------------')
    }
    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log('本次监听停止了哟～👋👋👋')
  })
}
module.exports = WatcherPlugin;

```

## 第六个例子：检测有没有使用`html-webpack-plugin`插件

`Compiler`对象中，包含了 Webpack 环境所有的的配置信息，包含 `options`，`hook`，`loaders`，`plugins` 这些信息。

那么这样就可以通过`plugins`来判断是否使用了`html-webpack-plugin`了

```js
function DecideHtmlPlugin () {}

DecideHtmlPlugin.prototype.apply = function (compiler) {
  compiler.hooks.afterPlugins.tap('DecideHtmlPlugin', compiler => {
    const plugins = compiler.options.plugins;
    const hasHtmlPlugin = plugins.some(plugin => {
      return plugin.__proto__.constructor.name === 'HtmlWebpackPlugin'
    })
    if (hasHtmlPlugin) {
      console.log('使用了html-webpack-plugin')
    }
  })
}

module.exports = DecideHtmlPlugin

```

有需要注意的点⚠️：

- `afterPlugins`：设置完初始插件之后，执行插件。
- `plugins`拿到的会是一个插件列表，包括我们的自定义插件`DecideHtmlPlugin`也会在里面
- `some()`是`Array.prototype`上的方法，用于判断某个数组是否有符合条件的项，只要有一项满足就返回`true`，否则返回`false`

## 第七个例子：实现一个简易版的`clean-webpack-plugin`

在每次重新编译之后，都会自动清理掉上一次残余的`dist`文件夹中的内容，不过需要满足以下需求：

- 插件的`options`中有一个属性为`exclude`，为一个数组，用来定义不需要清除的文件列表
- 每次打包如果文件有修改则会生成新的文件且文件的指纹也会变(文件名以`hash`命名)
- 生成了新的文件，则需要把以前的文件给清理掉。

