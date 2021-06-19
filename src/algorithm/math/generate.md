```js
/*
给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。
在杨辉三角中，每个数是它左上方和右上方的数的和。
示例:
输入: 5
输出:
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]
*/

//规律：每行元素等于上一行元素前一个下标的值加上当前下边的值
var generate = function(numRows) {
	 if (numRows === 0) return [];
  if (numRows === 1) return [[1]];
  const re = [[1]];
  for (let i = 1; i < numRows; i++) {
    const row = [];
    for (let j = 0; j <= i; j++) {
      row[j] = (re[i - 1][j - 1] || 0) + (re[i - 1][j] || 0);
    }
    re.push(row);
  }
  return re;
};

```
