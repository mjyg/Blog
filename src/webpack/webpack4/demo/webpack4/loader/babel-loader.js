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