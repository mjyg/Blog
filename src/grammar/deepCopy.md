# 深拷贝

深拷贝就是完完整整的将一个对象从内存中拷贝一份出来。所以无论用什么办法，必然绕不开开辟一块新的内存空间。

通常有下面两种方法实现深拷贝：
* 1.迭代递归法
* 2.序列化反序列化法

测试方法如下,对js各数据类型进行测试：
```js
const test = {
  num: 0,
  str: "",
  boolean: true,
  undefined: undefined,
  null: null,
  obj: {
    name: "我是一个对象",
    id: 1
  },
  arr: [0, 1, 2],
  func: function() {
    console.log("我是一个函数");
  },
  date: new Date(0),
  reg: new RegExp("/我是一个正则/ig"),
  err: new Error("我是一个错误")
};

const result = deepClone(test);
console.log(result);
for (const key in result) {
  if (isObject(result[key]))
    console.log(`${key}相同吗？ `, result[key] === test[key]);
}
```

## 递归迭代法
对对象进行迭代操作，对它的每个值进行递归深拷贝。
```js
function deepClone(obj) {
  if (!isObject(obj)) {
    throw "不是一个对象";
  }
  const re = Array.isArray(obj) ? [] : [];
  for (const key of Object.keys(obj)) {
    re[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
  }
  return re;
}

//判断是否是对象
function isObject(obj) {
  return (typeof obj === "object" || typeof obj === "function") && obj !== null;
}
```
结果如下：
```
[
  num: 0,
  str: '',
  boolean: true,
  undefined: undefined,
  null: null,
  obj: [ name: '我是一个对象', id: 1 ],
  arr: [ 0, 1, 2 ],
  func: [],
  date: [],
  reg: [],
  err: []
]
obj相同吗？  false
arr相同吗？  false
func相同吗？  false
date相同吗？  false
reg相同吗？  false
err相同吗？  false
```
可以看到：func、date、reg 和 err 没有复制成功，基本数据类型、obj和arr深拷贝成功

## lodash中的深拷贝
```js
function deepClone(obj){
  return _.cloneDeep(obj)
}
```
结果如下：
```
{
  num: 0,
  str: '',
  boolean: true,
  undefined: undefined,
  null: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [ 0, 1, 2 ],
  func: [Function: func],
  date: 1970-01-01T00:00:00.000Z,
  reg: /\/我是一个正则\/ig/,
  err: Error: 我是一个错误
      at Object.<anonymous> (D:\zyj\git\Blog\test.js:26:8)
      at Module._compile (internal/modules/cjs/loader.js:1133:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1153:10)
      at Module.load (internal/modules/cjs/loader.js:977:32)
      at Function.Module._load (internal/modules/cjs/loader.js:877:14)
      at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:74:12)
      at internal/main/run_main_module.js:18:47
}
obj相同吗？  false
arr相同吗？  false
func相同吗？  true
date相同吗？  false
reg相同吗？  false
err相同吗？  true
```
可以看出都复制成功了，但是function和error的深拷贝失败，它们的内存引用仍然不变

## 序列化反序列化法
先把对象序列化成字符串，再反序列化回对象
> 注意JSON.stringify不支持BigInt，要把它去掉
```js
function deepClone(obj){
  return JSON.parse(JSON.stringify(obj))
}
```
结果如下：
```
{
  num: 0,
  str: '',
  boolean: true,
  null: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [ 0, 1, 2 ],
  date: '1970-01-01T00:00:00.000Z',
  reg: {},
  err: {}
}
obj相同吗？  false
arr相同吗？  false
reg相同吗？  false
err相同吗？  false
```
可以看出func被忽略了，reg和error复制失败，date复制后变成了字符串，只有基本数据类型、obj和arr深拷贝
成功。

> 总结：递归迭代法和序列化反序列化法比较适合平常开发中使用，因为通常不需要考虑对象和数组之外的类型。