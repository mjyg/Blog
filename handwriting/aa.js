//1.延时执行的防抖函数: 在延时范围内只执行一次，且不是立即执行，只会执行延时范围内最后调用的那一次
function debounce(func, delay = 5) {
  let timer = null;
  return function (args) {
    console.log('timer:', timer);
    clearTimeout(timer);
    timer = setTimeout(function () {
      func(args);
    }, delay);
  }
}

function realExecute() {
  console.log('real execute: ' + new Date());
}

let callDebounce = debounce(realExecute, 5000);

/*
document.getElementById('testButton').addEventListener('click', function() {
  console.log('test button: ' + new Date());
  // console.log('this1:', this); //this指向调用该函数的button，写成箭头函数的话，this指向window对象
  callDebounce();  //写成这样，所有点击事件共用一个timer，防抖函数才起作用
  // debounce(realExecute, 5000)();  //写成这样每次timer都会初始化，防抖函数不起作用
});

//或者写成这样
document.getElementById('testButton').addEventListener('click',
  debounce(realExecute, 5000));
*/


//2.立即执行的防抖函数:不希望非要等到事件停止触发后才执行，希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。
function debounceWithImmediately(func, delay = 5, immediate = true) {
  let timer = null;
  return function (args) {
    clearTimeout(timer);
    if (immediate) {
      if (!timer) { //若timer为null，则表示停止触发了n秒后的第一次触发，可以立即执行一次
        func(args);
      }
      timer = setTimeout(function () { //单独控制timer是否为null的定时器
        timer = null;  //当等待n秒后，可以再一次立即执行
      }, delay);
    }
    timer = setTimeout(function () {
      func(args);
    }, delay);
  }
}

// document.getElementById('testButton').addEventListener('click',
//   debounceWithImmediately(realExecute, 5000));

//3.带有取消防抖的立即执行函数，即调用取消防抖可以清除延时，立即执行
function debounceWithImmediatelyAndCancel(func, delay = 5, immediate = true) {
  let timer = null;
  let debounce = (args) => {
    clearTimeout(timer);
    if (immediate) {
      if (!timer) {
        func(args);
      }
      timer = setTimeout(function () {
        timer = null;
      }, delay);
    }
    timer = setTimeout(function () {
      result = func(args);
    }, delay);

  };
  debounce.cancel = () => {
    clearTimeout(timer); //清除定时器
    timer = null; //下次调用可以立即执行
  };
  return debounce;
}

let debounceAction = debounceWithImmediatelyAndCancel(realExecute, 5000);

document.getElementById('testButton').addEventListener('click', debounceAction);
document.getElementById('cancelButton').addEventListener('click', debounceAction.cancel);
