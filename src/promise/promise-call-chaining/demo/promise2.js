/*理解promise链式调用,第二种写法*/

//multiply2和add2不用返回promise也可以实现链式调用，只不过这样写没有用setTimeout里的resolve，都是立即执行
// 0.5秒后返回input*input的计算结果:
function multiply2(input) {
  console.log("calculating " + input + " x " + input + "...");
  return input * input;
}

// 0.5秒后返回input+input的计算结果:
function add2(input) {
  console.log("calculating " + input + " + " + input + "...");
  return input + input;
}

var p2 = new Promise(function (resolve, reject) {
  console.log("start new Promise...");
  resolve(3);  //resolve的时候会调用之后then里面第一个参数指定的函数,即multiply2
});

p2.then(multiply2)
  .then(add2)
  .then(function (result) {
    console.log("Got value: " + result);
  });

/*
结果：
start new Promise...
calculating 3 x 3...
calculating 9 + 9...
Got value: 18
 */

//理解：Promise 能够链式调用的原理:promise 的 then/catch 方法执行后会也返回一个 promise
//(p2.then(multiply2)返回一个promise），该promise的then方法里的参数指定的函数(add2)可以拿到上一个
// then里参数返回的结果作为参数，即add2拿到multiply2返回结果作为参数

/*
结论：
对于 then 方法返回的 promise 没有 resolve 函数的，取而代之只要 then 中回调的代码执行完毕并获得
同步返回值，这个 then 返回的 promise 就算被 resolve,同步返回值的意思换句话说如果 then 中的回调返
回了一个 promise，那么 then 返回的 promise 会等待这个 promise 被 resolve 后，再往微任务队列推入一
个任务，而这个任务的作用是 resolve 包裹这个回调的 then 方法返回的 promise
若回调的返回值非 promise ，则直接 resolve，不会有前面的额外逻辑
 */

