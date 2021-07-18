组件化

性能优化：
* webpack缓存压缩分包Tree Shaking
* webpack 组件动态加载,公共资源打包
* DOM数量控制
* CSS GPU加速, CSS Matrix
* 前端性能监控，通过可视化图表展示性能指标数据
* FCP/FMP
* sdk
* 减少首屏时间：
    * 利用浏览器缓存策略缓存静态资源，异步import模块减少首屏js体积
    * 在webpack中配置首屏预渲染内容。前置SPA应用FCP时间
    * React的state批处理，PureComponent,memo减少组件不必要的更新渲染

React:
* 源码
* 使用hook函数式组件构建通用组件（form,table）
* 自定义hook（request,节流函数）提升团队开发效率
* React 同构

CI/CD

单元测试

eslint配置

babel配置

脚手架
对vue-cli做二次封装

pm2

CSS:
* BEM+原子CSS命名规范，规范化开发
* css-houdini
* next
* 矩阵

V8
* 快属性 慢属性

node中间层，接口的削减

koa：
* 搭建中间层
* 洋葱模型

typescript:
* vue组件，简单的语法

网络协议：
* TCP/IP
* HTTP
* HTTP2

技术栈：sdk + rollup + FCP/FMP

new Vue({})为什么属性越多越慢？
V8快属性，慢属性 -> 词法解析，语法解析 -> ast -> 字节码 -> ao vo go -> 收集代码信息 -> 优化字节码 生成机器码

工程化： CI/CD webpack原理 webpack5工程化

前端安全：xss csrf webshell 劫持 beem 中国菜刀 web渗透

webpack集群编译

types-react

