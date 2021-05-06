# 防抖函数

**目录**
> * [第一步：基本功能](#第一步基本功能)
> * [第二步：修正this](#第二步修正this)
> * [第三步：获取event对象](#第三步获取event对象)

在函数频繁被调用时有时需要用到防抖函数，比如事件频繁触发时，一定要在触发事件的n秒后再执行，如果n秒内又触发了
事件，则以新的事件时间为准，再等待秒后再执行
```js
var count = 1;
var container = document.getElementById('container');

function getUserAction() {
  console.log('this', this)
  container.innerHTML = count++;
};

container.onmousemove = getUserAction;
```
getUserAction函数在鼠标划过container时会执行上百次，需要用防抖函数，不管划过多少次，划过1秒后再执行，若
1秒内又划过，则重新计时1秒后再执行

## 第一步：基本功能
```js
function debounce(func, wait) {
  var timeout;
  return function() {
    clearTimeout(timeout)  //频繁调用时清除定时器，重新计时
    timeout = setTimeout(func, wait)
  }
}
```
使用防抖函数：
```js
container.onmousemove = debounce(getUserAction,1000);
```
可看出只在鼠标划过后1秒才执行一次getUserAction

## 第二步：修正this
在不用防抖函数时，在getUserAction内this指向container元素，而使用了防抖函数后，setTimeout里的this
永远指向window，需要修正this指向调用者：
```js
function debounce(func, wait) {
  var timeout;
  return function() {
    const context = this
    clearTimeout(timeout)  //频繁调用时清除定时器，重新计时
    timeout = setTimeout(function(){
      func.apply(context); //修正this指向调用者
    }, wait)
  }
}
```
## 第三步：获取event对象
JavaScript 在事件处理函数中会提供事件对象 event：
```js
function getUserAction(e) {
  console.log('e', e) //MouseEvent
  container.innerHTML = count++;
};
```
做如下修改：
```js
function debounce(func, wait) {
  var timeout;
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timeout)  //频繁调用时清除定时器，重新计时
    timeout = setTimeout(function(){
      func.apply(context, args); //修正this,传入event对象
    }, wait)
  }
}
```
