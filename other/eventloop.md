# EventLoop

**目录**
> * [浏览器中的EventLoop](#浏览器中的EventLoop)
> * [NodeJS中的EventLoop](#NodeJS中的EventLoop)

## 浏览器中的EventLoop
* 练习1
```js
async function fn(){
  return  1234
  //return await 1234
}
fn().then(res=>console.log(res))  //1234
```
说明：async函数会返回一个promise对象

* 练习2
```js
async function fn(){
  return {
    then(resolve){
      resolve({
        then(r){
          r(1)
        }
      })
    }
  }
}
fn().then(res=>console.log(res))  //1
```
说明：遇到thenable会递归使用promise.then调用，直到resolve返回值是一个基础类型

* 练习3
```js
async function async1(){
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2(){
  console.log('async2')
}
async1()
console.log('script')
/*
async1 start
async2
script
async1 end
 */
```
说明：上面的代码可转换成如下：
```js
async function async1(){
  console.log('async1 start')

  //转换
  new Promise(resolve => {
    console.log('async2')
    resolve()
  }).then(res => console.log('async1 end'))
}
async1()
console.log('script')
```

* 练习4
```js
async function async1() {
  console.log("async1 start");

  await new Promise((resolve) => {
    console.log("promise1");
  });

  console.log("async1 success");
  return "async1 end";
}

console.log("script start");
async1().then((res) => console.log("script end"));
console.log("script end");

/*
script start
async1 start
promise1
script end
 */
```
说明：async里的promise函数没有resolve，用于是未完成状态，不会执行async1里的then()<br>
改成如下：
```js
async function async1() {
  console.log("async1 start");

  await new Promise((resolve) => {
    console.log("promise1");
    resolve()  //promise返回，状态变更才会向下执行
  });

  console.log("async1 success");
  return "async1 end";
}

console.log("script start");
async1().then((res) => console.log("script end"));
console.log("script end");

/*
script start
async1 start
promise1
script end
async1 success
async1 end
 */
```

## NodeJS中的EventLoop
* 练习1
```js
setTimeout(a => console.log('setTimeout'))
setImmediate(a => console.log('setImmediate'))
/*
setTimeout
setImmediate
 */
```
说明：setTimeout和setImmediate执行顺序不固定,如果两者都在一个poll阶段注册，那么执行顺序就能确定：
```js
const fs = require('fs')
fs.readFile('./index.html',()=>{
  setTimeout(a => console.log('setTimeout'))
  setImmediate(a => console.log('setImmediate'))
})
/*
setImmediate
setTimeout
 */
```

* 练习2
```js
setImmediate((a) => console.log("setImmediate"));
process.nextTick(() => {
  console.log("nextTick");
});
/*
nextTick
setImmediate
 */
```
说明：process.nextTick()在同一个阶段的尾部立即执行，setImmediate()在时间循环的check阶段触发

* 练习3：不同Node版本中的EventLoop
```js
setImmediate((a) => console.log("setImmediate1"));
setImmediate(() => {
  console.log("setImmediate2");
  process.nextTick(()=>{console.log('next tick')})
});
setImmediate((a) => console.log("setImmediate3"));
setImmediate((a) => console.log("setImmediate4"));
```
node 11 版本之前：一旦执行一个阶段，会先将这个阶段里的所有任务执行完成之后，才会执行该阶段剩下的微任务<br>
打印如下：
```
setImmediate1
setImmediate2
setImmediate3
setImmediate4
next tick
```
node11版本之后：和浏览器行为保持了一致，一旦执行了一个阶段里的一个宏任务，就立刻执行对应的微任务队列<br>
打印如下：
```
setImmediate1
setImmediate2
next tick
setImmediate3
setImmediate4
```