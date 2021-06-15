```js
/*
给定一个 n × n 的二维矩阵表示一个图像。
将图像顺时针旋转 90 度。
说明：
你必须在原地旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要使用另一个矩阵来旋转图像。
 */
/*
示例 1:
给定 matrix =
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],
原地旋转输入矩阵，使其变为:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
 */
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  //先按水平线翻转，再按对角线翻转
  //时间复杂度O(n*n),空间复杂度O(1)
  let n = matrix.length;

  //水平翻转
  for (let x = 0; x < (n / 2) >> 0; x++) {
    for (let y = 0; y < n; y++) {
      [matrix[x][y], matrix[n - x - 1][y]] = [matrix[n - x - 1][y], matrix[x][y]];
    }
  }

  //对角线翻转
  for (let x = 0; x < n; x++) {
    for (let y = x + 1; y < n; y++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
};

const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
rotate(matrix);
console.log(matrix);

```
