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
有循环引用会报错

> 总结：递归迭代法和序列化反序列化法比较适合平常开发中使用，因为通常不需要考虑对象和数组之外的类型。

## 迭代递归方法（解决闭环问题）
```js
function deepCopy(data, hash = new WeakMap()) {
  if(typeof data !== 'object' || data === null){
        throw new TypeError('传入参数不是对象')
    }
  // 判断传入的待拷贝对象的引用是否存在于hash中
  if(hash.has(data)) {
        return hash.get(data)
    }
  let newData = {};
  const dataKeys = Object.keys(data);
  dataKeys.forEach(value => {
     const currentDataValue = data[value];
     // 基本数据类型的值和函数直接赋值拷贝 
     if (typeof currentDataValue !== "object" || currentDataValue === null) {
          newData[value] = currentDataValue;
      } else if (Array.isArray(currentDataValue)) {
         // 实现数组的深拷贝
        newData[value] = [...currentDataValue];
      } else if (currentDataValue instanceof Set) {
         // 实现set数据的深拷贝
         newData[value] = new Set([...currentDataValue]);
      } else if (currentDataValue instanceof Map) {
         // 实现map数据的深拷贝
         newData[value] = new Map([...currentDataValue]);
      } else { 
         // 将这个待拷贝对象的引用存于hash中
         hash.set(data,data)
         // 普通对象则递归赋值
         newData[value] = deepCopy(currentDataValue, hash);
      } 
   }); 
  return newData;
}
```
比之前的1.0版本多了个存储对象的容器WeakMap，思路就是，初次调用deepCopy时，参数会创建一个WeakMap结构
的对象，这种数据结构的特点之一是，存储键值对中的健必须是对象类型。首次调用时，weakMap为空，不会走上面
那个if(hash.has())语句，如果待拷贝对象中有属性也为对象时，则将该待拷贝对象存入weakMap中，此时的健值
和健名都是对该待拷贝对象的引用然后递归调用该函数再次进入该函数，传入了上一个待拷贝对象的对象属性的引用
和存储了上一个待拷贝对象引用的weakMap，因为如果是循环引用产生的闭环，那么这两个引用是指向相同的对象的
，因此会进入if(hash.has())语句内，然后return，退出函数，所以不会一直递归进栈，以此防止栈溢出。
