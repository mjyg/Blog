/*
给你一个二维整数数组 matrix， 返回 matrix 的 转置矩阵 。
矩阵的 转置 是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。
 */
/*
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[1,4,7],[2,5,8],[3,6,9]]
 */
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
  if (!matrix.length) return [];
  const rowNum = matrix.length;
  const colNum = matrix[0].length;

  //初始化二维数组
  let re = new Array(colNum).fill(null).map(()=>new Array(rowNum))

  // let re2 = []
  // for (let i = 0; i < colNum; i++) {
  //   re2.push([]);
  // }

  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      re[j][i] = matrix[i][j];
    }
  }
  return re;
};

var transpose2 = function(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const transposed = new Array(n).fill(0).map(() => new Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }
  return transposed;
};


console.log(
  transpose([
    [-51, 36, -31, 23],
    [3, 12, -31, 65],
    [-20, 2, -42, -62],
    [0, -49, 75, 77],
    [-52, 46, 45, 37],
    [-98, 17, 14, 78],
    [50, 88, -15, -31],
    [84, -59, -96, 23],
    [42, 1, 48, 81],
    [-92, 95, -71, 37],
  ])
);

```
