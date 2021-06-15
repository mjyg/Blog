const Rize = require('rize')
const rize = new Rize()
rize
    .goto('https://github.com/')  //github网页
    .type('input.header-search-input', 'node111') //搜索框输入'node111'
    .press('Enter') //输入回车
    .waitForNavigation()
    .assertSee('Node.js')  //页面是否有Node.js
    .end()  // 别忘了调用 `end` 方法来退出浏览器！
