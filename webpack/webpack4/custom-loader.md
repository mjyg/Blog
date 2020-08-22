# 自定义loader
**目录**
> * [markdown-loader](#markdown-loader)
> * [babel-loader](#babel-loader)

## markdown-loader
```js
"use strict";

//所有的loader都不干活，像marked-loader实际干活的是marked，babel-loader实际干活的是babel
const marked = require("marked");

//设置loader外边的参数，里边可以得到
const loaderUtils = require("loader-utils");

module.exports = function (markdown) {
  // merge params and default config
  const options = loaderUtils.getOptions(this);

  this.cacheable();

  marked.setOptions(options);

  return marked(markdown);
};
```
## babel-loader
创建loader/babel-loader.js:
```js
"use strict";
//自定义loader
const loaderUtils = require("loader-utils");
const acorn = require("acorn");
const walk = require("acorn-walk");
const MagicString = require('magic-string')
module.exports = function (context) {
  console.log('前置钩子', this.data.value) //前置钩子 我是前置钩子

  const options = loaderUtils.getOptions(this);
  console.log('配置文件',options)  //{ data: '🍌自定义配置项' }

  const ast = acorn.parse(context);//生成AST
  // console.log("🌺ast", ast);
  // Node {
  //   type: 'Program',
  //     start: 0,
  //     end: 98,
  //     body: [
  //     Node {
  //       type: 'VariableDeclaration',
  //       start: 62,
  //       end: 80,
  //       declarations: [Array],
  //       kind: 'let'
  //     },
  //     Node {
  //       type: 'ExpressionStatement',
  //       start: 81,
  //       end: 98,
  //       expression: [Node]
  //     }
  //   ],
  //     sourceType: 'script'
  // }

  const code = new MagicString(context)
  walk.simple(ast,{
    VariableDeclaration(node){
      console.log('node',node)
      const {start} = node
      code.overwrite(start, start + 3, 'var');  //把let替换成var
    }
  })
  return code.toString();
};

//配前置钩子
module.exports.pitch=function(r,p,data){
  data.value='我是前置钩子'
}
```
webpack.config.js修改成如下：
```js
const ConsoleLogOnBuildWebpackPlugin = require('./plugin/ConsoleLogOnBuildWebpackPlugin')
const path = require('path')

module.exports={
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: path.resolve('./loader/babel-index.js'),  //引用自己写的loader
          options: {
            data:'🍌自定义配置项'
          }
        }
      }
    ]
  },
  plugins: [new ConsoleLogOnBuildWebpackPlugin()]
}
```
src/index.js内容为：
```js
let data = 'hello'
console.log(data)
```
执行编译命令，编译后的文件中，index,js的eval()中let被替换成了var<br>
本文demo见[webpack4 demo](./demo/webpack4)
