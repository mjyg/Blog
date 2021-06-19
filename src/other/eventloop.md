# EventLoop

**目录**
> * [浏览器中的EventLoop](#浏览器中的EventLoop)
> * [NodeJS中的EventLoop](#NodeJS中的EventLoop)
> * [宏任务和微任务](#宏任务和微任务)

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

## 宏任务和微任务
```
事件循环是通过任务队列的机制来进行协调的。一个 Event Loop 中，可以有一个或者多个任务队列
(task queue)，一个任务队列便是一系列有序任务(task)的集合；每个任务都有一个任务源(task source)，
源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。 setTimeout/Promise
等API便是任务源，而进入任务队列的是他们指定的具体执行任务。

宏任务：可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行
栈中执行）。浏览器为了能够使得JS内部(macro)task与DOM任务能够有序的执行，会在一个(macro)task执行结束
后，在下一个(macro)task 执行开始前，对页面进行重新渲染
宏任务(源)主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、
MessageChannel、setImmediate(Node.js 环境)

微任务：可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，
在渲染之前。所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染。也就是说，
在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）。
微任务(源)主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)
 ```
 ```js
//练习1：
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('settimeout')
})
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')
console.log('---------------')

/*执行顺序：（不同环境执行顺序稍有不一样，下面是在谷歌浏览器下面执行）
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout

解析：(来自同类型的任务源在同一个队列)
第一次宏任务(宏任务源：script整体代码)：
  script start
  async1 start
  async2
  promise1
  script end
执行完毕以后执行在第一次宏任务期间遇到的所有微任务(微任务源：promise)：
  async1 end
  promise2
再执行第二次宏任务(宏任务源：setTimeout)：
  setTimeout
*/

//练习2
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  //async2做出如下更改：
  new Promise(function(resolve) {
    console.log('promise1');
    resolve();
  }).then(function() {
    console.log('promise2');
  });
}
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0)
async1();

new Promise(function(resolve) {
  console.log('promise3');
  resolve();
}).then(function() {
  console.log('promise4');
});

console.log('script end');
console.log('-------------')

/*执行顺序：（不同环境执行顺序稍有不一样，下面是在谷歌浏览器下面执行）
  script start
  async1 start
  promise1
  promise3
  script end
  promise2
  async1 end
  promise4
  settimeout

解析：
第一次宏任务：
  script start
  async1 start
  promise1
  promise3
  script end
执行完毕以后执行在第一次宏任务期间遇到的所有微任务：
  promise2
  async1 end
  promise4
再执行第二次宏任务：
  setTimeout
*/

//练习3
async function async1() {
  console.log('async1 start');
  await async2();
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout1')
  },0)
}
async function async2() {
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout2')
  },0)
}
console.log('script start');

setTimeout(function() {
  console.log('setTimeout3');
}, 0)
async1();

new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');

/*执行顺序：（不同环境执行顺序稍有不一样，下面是在谷歌浏览器下面执行）
  script start
  async1 start
  promise1
  script end
  promise2
  setTimeout3
  setTimeout2
  setTimeout1

解析：
第一次宏任务：
 script start
  async1 start
  promise1
  script end
执行完毕以后执行在第一次宏任务期间遇到的所有微任务：
  promise2
再执行第二次宏任务：
  setTimeout3
  setTimeout2
  setTimeout1
*/

```
