/*
帮助理解这一块代码：
var promise = new Promise(function (resolve, reject) {
  //installedChunks[chunkId]等于一个Promise,表示该chunk已经被加载
  installedChunkData = installedChunks[chunkId] = [resolve, reject];
});
// 将构造的这个 promise 加入队列
//promises:[promise]
//installedChunkData:[resolve, reject, promise]
promises.push((installedChunkData[2] = promise));
*/
var list = [];
var a = [3];
list.push(a[1]=2)
console.log(list) //[2]
console.log(a) //[3,2]