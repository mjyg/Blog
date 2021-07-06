* 二维组初始化
```javascript
let re = new Array(colNum).fill(null).map(()=>new Array(rowNum))

let re2 = []
for (let i = 0; i < colNum; i++) {
  re2.push([]);
}
```
注意：不填null无法初始化成功<br>
[](image/note1.png)

* 正则表达式

（1）加/g
```js
var reg = /yi/g
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 2
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 8
console.log(reg.test('yidesdyi'),reg.lastIndex)  //false 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 2
```
（2）不加/g
```js
var reg = /yi/
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
```

* npm的语义版本控制
  * ^: 只会执行不更改最左边非零数字的更新。 如果写入的是 ^0.13.0，则当运行 npm update 时，可以更新
  到 0.13.1、0.13.2 等，但不能更新到 0.14.0 或更高版本。 如果写入的是 ^1.13.0，则当运行 npm update
   时，可以更新到 1.13.1、1.14.0 等，但不能更新到 2.0.0 或更高版本。
  * ~: 如果写入的是 〜0.13.0，则当运行 npm update 时，会更新到补丁版本：即 0.13.1 可以，但 0.14.0 
  不可以。
  * >: 接受高于指定版本的任何版本。
  * >=: 接受等于或高于指定版本的任何版本。
  * <=: 接受等于或低于指定版本的任何版本。
  * <: 接受低于指定版本的任何版本。
  * =: 接受确切的版本。
  * -: 接受一定范围的版本。例如：2.1.0 - 2.6.2。
  * ||: 组合集合。例如 < 2.1 || > 2.6。