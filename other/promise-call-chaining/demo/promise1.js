/*理解promise链式调用*/

// 0.5秒后返回input*input的计算结果:
function multiply(input) {
  return new Promise(function (resolve, reject) {
    console.log("calculating " + input + " x " + input + "...");
    setTimeout(resolve, 500, input * input);
  });
}

// 0.5秒后返回input+input的计算结果:
function add(input) {
  return new Promise(function (resolve, reject) {
    console.log("calculating " + input + " + " + input + "...");
    setTimeout(resolve, 500, input + input);
  });
}

var p = new Promise(function (resolve, reject) {
  console.log("start new Promise...");
  resolve(3);//resolve的时候会调用之后then里面第一个参数指定的函数,即multiply2
});

p.then(multiply)
  .then(add)
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

//理解：multiply和add都返回一个promise,则下一个then函数里参数指定的函数需要上一个then里参数指定的
// 函数resolve才能调用，即add需要在multiply执行resolve才会被调用