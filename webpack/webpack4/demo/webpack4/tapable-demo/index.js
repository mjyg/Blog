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