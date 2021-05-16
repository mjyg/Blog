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
** 加/g
```js
var reg = /yi/g
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 2
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 8
console.log(reg.test('yidesdyi'),reg.lastIndex)  //false 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 2
```
** 不加/g
```js
var reg = /yi/
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
console.log(reg.test('yidesdyi'),reg.lastIndex)  //true 0
```