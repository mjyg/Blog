```js
/*
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。
问总共有多少条不同的路径？
示例 1:
输入: m = 3, n = 2
输出: 3
解释:
从左上角开始，总共有 3 条路径可以到达右下角。
1. 向右 -> 向右 -> 向下
2. 向右 -> 向下 -> 向右
3. 向下 -> 向右 -> 向右
 */
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
  //动态规划：每次只能向下或向右走一步，f[x][y]=f[x-1]+[y]+f[x][y-1]
  //空间复杂度和时间复杂度都为O(m*n)
  const f = [];
  for (let i = 0; i < m; i++) {
    f.push([]);
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) {
        f[i][j] = 1;
      } else {
        f[i][j] = f[i - 1][j] + f[i][j - 1]; //优化点：从这里看出只需要上一行的数据和当前行的数据
      }
    }
  }
  return f[m - 1][n - 1];
};

var uniquePaths2 = function(m, n) {
  //动态规划优化1:每次保留当前行和上一行的数据，不保存整个网格的数据
  //时间复杂度为O(m*n)，空间复杂度为O(2n)
  if (m === 1 || n === 1) return 1;

  const cur = Array(n).fill(1); //当前行
  let pre = new Array(n).fill(1); //上一行
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      cur[j] = cur[j - 1] + pre[j];
    }
    pre = cur.slice();
  }
  return cur[n - 1];
};

var uniquePaths3 = function(m, n) {
  //动态规划优化3:去掉pre，不需要保留上一行数据,直接用cur的上一行数据即可
  //时间复杂度为O(m*n)，空间复杂度为O(n)
  if (m === 1 || n === 1) return 1;

  const cur = new Array(n).fill(1); //当前行
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      cur[j] = cur[j - 1] + cur[j];
    }
  }
  return cur[n - 1];
};

var uniquePaths4 = function(m, n) {
  //排列组合法：要到达终点必须向下走n-1步,向右走m-1步，总共需要移动m+n-2次，即从m+n-2中选出m-1种向下移动的方法
  let re = 1;
  if (m === 1 || n === 1) return re;
  for (let i = 1; i <= m - 2; i++) {
    re *= (n + i) / i;
  }
  return (re * n) / (m - 1);
};

console.log(uniquePaths2(3, 2));

```
