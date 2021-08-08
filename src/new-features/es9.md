# ES9新增语法

**目录**
> * [异步迭代器和异步生成器](#异步迭代器和异步生成器)
> * [finally方法](#finally方法)
> * [Rest和Spread](#Rest和Spread)
> * [正则表达式命名捕获组](#正则表达式命名捕获组)
> * [正则表达式反向断言](#正则表达式反向断言)
> * [正则表达式dotAll模式](#正则表达式dotAll模式)
> * [正则表达式Unicode转义](#正则表达式Unicode转义)
> * [非转义序列的模板字符串](#非转义序列的模板字符串)

## 异步迭代器和异步生成器
先了解下迭代器和生成器
* 什么是迭代器？迭代器是一个会返回迭代器的特殊对象，该对象有一个next方法，调用next方法返回一个表示迭代
是否结束的标志done和迭代得到的值value<br>
手写一个迭代器：
```js
const createIterator = items => {
  const keys = Object.keys(items);
  const len = keys.length;
  let pointer = 0;
  return {
    next() {
      const done = pointer >= len
      return {
        done,
        value: !done ? items[pointer++] : undefined
      }
    }
  }
}
const it = createIterator(['a','b','c'])
console.log(it.next()) //{ done: false, value: 'a' }
console.log(it.next()) //{ done: false, value: 'b' }
console.log(it.next()) //{ done: false, value: 'c' }
console.log(it.next()) //{ done: true, value: ubdefined }
```
具有iterator接口，即有Symbol.iterator属性的变量可以使用for...of遍历，数组原生具有Symbol.iterator属性
```js
console.log([][Symbol.iterator]) //function
```
但是对象不具有Symbol.iterator属性，所以不能使用for...of遍历，可以给对象添加该属性,便可以使用for...of遍历
```js
const obj = {a:1,b:2,c:3}
obj[Symbol.iterator] = function(){
  const me = this;
  const keys = Object.keys(me);
  const len = keys.length;
  let pointer = 0;
  return {
    next() {
      const done = pointer >= len
      return {
        done,
        value: !done ? me[keys[pointer++]] : undefined
      }
    }
  }
}
for(const val of obj) {
  console.log(val)  // 1 2 3
}
```
* 什么是生成器？生成器Generator是一个特殊函数，返回一个生成器对象,执行函数时，并不会执行函数体，只是创
建了一个生成器对象
```js
function * fn(){
  console.log("执行函数");
  yield 1; //yield后的值是调用next()的value
  yield 2;
  yield 3;
  console.log('执行完了')
}

const a = fn() //没有任何打印,只是创建了一个生成器
console.log(a.next()) //执行函数  { value: 1, done: false }
console.log(a.next()) //  { value: 2, done: false }
console.log(a.next()) //  { value: 3, done: false }
console.log(a.next()) //执行完了  { value: undefined, done: true }
```
* 异步迭代器

异步迭代器和同步迭代器的区别:<br>
同步：next方法返回{value:'',done:false},使用for..of遍历<br>
异步：next方法返回promise,使用for...await...of遍历<br>
手写一个异步迭代器
```js
const createAsyncIterator = items => {
  const keys = Object.keys(items);
  const len = keys.length;
  let pointer = 0;
  return {
    next() {
      const done = pointer >= len
      return Promise.resolve({
        done,
        value: !done ? items[pointer++] : undefined
      })
    }
  }
}

const asyncIt = createAsyncIterator([1,2,3])
asyncIt.next().then(res=>console.log(res)) //{ done: false, value: 1 }
asyncIt.next().then(res=>console.log(res)) //{ done: false, value: 2 }
asyncIt.next().then(res=>console.log(res)) //{ done: false, value: 3 }
asyncIt.next().then(res=>console.log(res)) //{ done: true, value: undefined }
```
为对象添加异步迭代器，添加Symbol.asyncIterator属性，使用for...await...of进行遍历
```js
const asyncItems = {
  name:'yideng',
  age:4,
  [Symbol.asyncIterator](){
    const me = this
    const keys = Object.keys(me);
    const len = keys.length;
    let pointer = 0;
    return {
      next() {
        const done = pointer >= len
        return Promise.resolve({
          done,
          value: !done ? me[keys[pointer++]] : undefined
        })
      }
    }
  }
}

async function fn(){
  for await(const val of asyncItems){
    console.log(val)
  }
}

fn() //yideng 4
```
* 异步生成器
创建Generate函数，内部使用await等待异步方法执行完，手写一个异步生成器：
```js
async function * asyncfn(){
  yield await Promise.resolve(1)
  yield await Promise.resolve(2)
  yield await Promise.resolve(3)
}

async function fn(){
  for await(const val of asyncfn()){
    console.log(val)
  }
}
fn() // 1 2 3
```
## finally方法
Promise新增了finally方法，resolve或reject结束后执行
```js
function fn(){
  return new Promise((resolve, reject)=>{
    resolve('success')
    reject('error')
  })
}
fn()
  .then(res=>console.log(res))
  .catch(err=>onsole.log(err))
  .finally(()=>console.log('end'))
// success end
```

## Rest和Spread
ES9中扩展运算符可用于对象，ES9前只能用与数组
函数使用Rest参数
```js
function fn(a,b,...c){
  console.log(a,b,c)
}
fn(1,2,3,4,5) //1 2 [ 3, 4, 5 ]
```
使用Spread拼接数组
```js
const arr = [1,2,3]
console.log([11,22,...arr])//[ 11, 22, 1, 2, 3 ]
```
实现对象浅拷贝
```js
const obj2 = {...obj}
obj2.name = 'a2'
obj2.info.age = 5
console.log(obj) //{ name: 'a', info: { age: 5 } }
console.log(obj2) //{ name: 'a2', info: { age: 5 } }
```

## 正则表达式命名捕获组
通过一个例子学习：用正则表达式获取日期'2020-10-01'中的年月日<br>
以前老的方法：通过分组实现,最后使用下标得到年月日
```js
const dateStr = '2020-10-01'
const reg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/
const res = reg.exec(dateStr)
console.log(res[1],res[2],res[3])  //2020 10 01
```
通过es9的命名捕获组实现
```js
const reg2 = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
const res2 = reg2.exec(dateStr);
console.log(res2.groups.year,res2.groups.month,res2.groups.day) //2020 10 01
```
通过命名捕获组使用replace方法可以很方便把日期格式改为'10-01-2020'
```js
const newDate = dateStr.replace(reg2, `$<month>-$<day>-$<year>`)
console.log(newDate) //10-01-2020
```

## 正则表达式反向断言
先看看先行断言，获取'$123'的货币符号，先行断言使用`(？=pattern)`
```js
const str = '$123'
const reg = /\D(?=\d+)/
const re = reg.exec(str)
console.log(re[0]) //$
```
再使用反向断言（又叫后行断言)，获取'123'，反向断言使用`(?<=pattern)`
```js
const reg2 = /(?<=\D)\d+/
const re2 = reg2.exec(str)
console.log(re2[0]) //123
```

## 正则表达式dotAll模式
ES9通过在正则表达式后加弥补了正则表达式.匹配不到换行符的缺点
```js
const str = 'yi\ndeng'
console.log(/yi.deng/.test(str))  //false
console.log(/yi.deng/s.test(str))  //true
```

## 正则表达式Unicode转义
以前使用类似`/[\u4e00-\u9fa5]/`匹配汉字，繁琐不好记<br>
ES9新方法检测汉字：
```js
const str = '你好啊'
const reg = /\p{Script=Han}/u;
console.log(reg.test(str)) //true
```

## 非转义序列的模板字符串
字符串`\u{54}`会自动识别为unicode编码的字符'T'：
```js
console.log('\u{54}')  //T
```
使用ES9的String.raw可以取消转义：
```js
console.log(String.raw `\u{54}` ) //\u{54}
```