# 手写节流函数

**目录**
> * [1 时间戳实现](#1-时间戳实现)
> * [2 定时器实现](#2-定时器实现)
>   * [2-1 定时器实现1](#2-1-定时器实现1)
>   * [2-2 定时器实现2](#2-2-定时器实现2)
> * [3 时间戳和定时器实现结合](#3-时间戳和定时器实现结合)
> * [4 可以取消节流函数](#4-可以取消节流函数)


如果持续触发事件，每隔一段时间，只执行一次事件，有时间戳和定时器两种方式实现

## 1 时间戳实现
第一次调用开始计时，下次调用超过了wait时间，则执行函数，重新定时，否则,什么也不干
```js
function throttle(func, wait) {
  let previous = 0;
  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();  //把Date对象转化为时间戳，相当于new Date().valueOf()
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```
>缺点：第一次调用能立即执行，但是结束调用不能执行最后一次

## 2 定时器实现
第一次调用开始计时，下次调用超过了wait时间，则执行函数，重新定时，否则,什么也不干

### 2-1 定时器实现1
```js
function throttle(func, wait) {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      func.apply(context, args);
      timeout = setTimeout(function() {
        timeout = null;
      }, wait)
    }
  };
}
```
>缺点：第一次调用能立即执行，但是结束调用不能执行最后一次

### 2-2 定时器实现2
```js
function throttle(func, wait) {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        func.apply(context, args);
        timeout = null;
      }, wait)
    }
  };
}
```
>缺点：第一次调用不能立即执行，结束调用后wait时间内还能执行最后一次

## 3 时间戳和定时器实现结合
结合定时器和时间戳，实现第一次调用能立即执行，且结束调用还能最后执行一次
```js
function throttle(func, wait) {
  let timeout = null,
    previous = 0;
  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();
    //下次触发 func 剩余的时间
    let remaining = wait - (now - previous);
    if (remaining <= 0) {
      console.log("时间戳执行");
      // 时间戳执行执行过了，清空timeout，重新计时
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(function () {
        console.log("timeout执行");
        timeout = null;
        previous = +new Date();  //timeout执行过了，时间戳previous重新设值
        func.apply(context, args);
      }, remaining);
    }
  };
}
```

## 4 可以取消节流函数
```js
function throttle(func, wait) {
  let timeout = null,
    previous = 0;
  const th = function () {
    const context = this;
    const args = arguments;
    const now = +new Date();
    //下次触发 func 剩余的时间
    let remaining = wait - (now - previous);
    if (remaining <= 0) {
      console.log("时间戳执行");
      // 时间戳执行执行过了，清空timeout，重新计时
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(function () {
        console.log("timeout执行");
        timeout = null;
        previous = +new Date();  //timeout执行过了，时间戳previous重新设值
        func.apply(context, args);
      }, remaining);
    }
  };

  th.cancel = function() {
    clearTimeout(timeout)
    timeout = null
    previous = 0
  }

  return th
}
```
