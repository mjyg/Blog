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
  

