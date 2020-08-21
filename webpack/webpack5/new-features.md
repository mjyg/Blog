# Webpack5新特性尝鲜
**目录**
> * [单独使用await](#单独使用await)
> * [指定静态资源输出目录](#指定静态资源输出目录)
> * [真正的chunkId](#真正的chunkId)

![](/assets/webpack/webpack5.png)<br>
上图截自github,截止目前2020.8.20日，Webpack5的开发进度到78%<br>
使用Webpack5:
>* 升级Node到8
>* npm install webpack@next —save-dev
>* npm install webpack-cli —save-dev<br>
## 单独使用await
webpack5默认支持单独使用await,不需要和async配合使用
创建src/data.js:
```javascript
const data = '外部数据'
export default data
```
创建src/index.js:
```javascript
const dynmaic = await import('./data.js')
export const output = dynmaic.default + '🍊'  //外部数据🍊
```
或者index.js写成这样：
```javascript
const dynmaic = import('./data.js')
export const output = (await dynmaic).default + '🍊'//外部数据🍊
```
创建webpack配置文件webpack.config.js:
```javascript
module.exports = {
  experiments:{
    topLevelAwait:true,  //支持单独写await
  }
}
```
执行命令`webpack --mode development`,编译成功
>使用webpack4则会报错：'Module parse failed: Cannot use keyword 'await' outside an async function'
## 指定静态资源输出目录
创建src/index.css:
```css
body {
  background: url(./a.jpg);
}
```
修改index.js:
```javascript
import './index.css'
```
webpack.config.js增加配置：
```javascript
module.exports = {
  output:{
    assetModuleFilename:'images/[name].[hash:5][ext]'//指定静态资源输出目录
  },
  module:{
    rules:[
      {
        test:/\.(png|jpg|svg)$/i,
        type:'asset',
      },
      {
        test:/\.css$/i,
        use:['style-loader', 'css-loader']
      }
    ]
  },
  experiments:{
    topLevelAwait:true,  //支持单独写await
    asset:true //支持图片
  }
}
```
执行命令，打包后图片便可放在指定目录images：<br>
![](/assets/webpack/build-image.png)
## 真正的chunkId
修改index.js:
```javascript
import("./async").then((_) => {
  console.log(_);
});

import("./data").then((_) => {
  console.log(_);
});
```
创建async.js:
```javascript
const data2 = '异步数据'
export default data2
```
编译后结果如下：<br>
![](/assets/webpack/chunk-build.png)<br>
可以看到每个动态引用的js都有自己真正的chunkId<br>
webpack5可以在开发模式中启用了一个新命名的块 id 算法，该算法提供块(以及文件名)可读的引用。 模块 ID 
由其相对于上下文的路径确定，而不是webpack4那样以0,1标志<br>
![webpack4打包结果](/assets/webpack/chunk-build2.png)<br>
❀参考链接：[Webpack5.0 新特性尝鲜实战 🦀🦀](https://juejin.im/post/6844903795286081550#heading-2)
