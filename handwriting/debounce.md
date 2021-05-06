# 防抖函数

**目录**
> * [第一版：基本功能](#第一版：基本功能)


在函数频繁被调用时有时需要用到防抖函数，比如事件频繁触发时，一定要在触发事件的n秒后再执行，如果n秒内又触发了
事件，则以新的事件时间为准，再等待秒后再执行

## 第一版：基本功能
```js
function debounce(func, wait) {
  var timeout;
  return function() {
    clearTimeout(timeout)  //频繁调用时清除定时器，重新计时
    timeout = setTimeout(func, wait)
  }
}
```
