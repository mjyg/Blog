/*
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围。
*/
/*

输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
 */

// 深度优先搜索
// 从左上角遍历每一个陆地格子，再递归从四个方向搜索相邻的陆地格子，直到碰到水格子，递归返回
// 再搜索下一个陆地格子
// 注意搜索的时候要标记已经遍历过的不再遍历和遍历的边界
var numIslands = function (grid) {
  const l = grid.length;
  const w = grid[0].length;
  let num = 2;

  for (let i = 0; i < l; i++) {
    for (let j = 0; j < w; j++) {
      if (Number(grid[i][j]) !== 1) continue; //遍历过的不再遍历
      DFS(i, j); //格子里一样的num代表一个岛屿
      num++;
    }
  }
  return num - 2;

  // 深度遍历
  function DFS(i, j) {
    grid[i][j] = num; //遍历过的格子置为num

    // 依次向四个方向深度遍历，
    // 这里满足条件再进入递归比先进入递归再判断是否满足条件要节省时间开销，在leetcode上表现为时间大概节省20ms
    if (i - 1 >= 0 && Number(grid[i - 1][j]) === 1) {
      DFS(i - 1, j);
    }
    if (i + 1 < l && Number(grid[i + 1][j]) === 1) {
      DFS(i + 1, j);
    }
    if (j - 1 >= 0 && Number(grid[i][j - 1]) === 1) {
      DFS(i, j - 1);
    }
    if (j + 1 < w && Number(grid[i][j + 1]) === 1) {
      DFS(i, j + 1);
    }
  }
};
/*
时间复杂度：O(MN)，其中 M 和 N 分别为行数和列数。
空间复杂度：O(MN)，在最坏情况下，整个网格均为陆地，深度优先搜索的深度达到MN。
 */


// 广度优先搜索
// 扫描整个二维网格。如果一个位置为 1，则将其加入队列，开始进行广度优先搜索。
// 在广度优先搜索的过程中，每个搜索到的 1 都会被重新标记为 0。直到队列为空，搜索结束。
// 最终岛屿的数量就是我们进行广度优先搜索的次数。
const numIslands2 = (grid) => {
  const queue = [];
  const l = grid.length;
  const w = grid[0].length;
  let num = 0;
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < w; j++) {
      if (grid[i][j] === "1") {
        num++;
        queue.push([i, j]);
        while (queue.length) {
          const [i, j] = queue.shift();

          grid[i][j] = "0";  //搜索过的标记为0

          // 搜索[i,j]的四个方向，是陆地格子加入到队列中
          if (i - 1 >= 0 && grid[i - 1][j] === "1") {
            queue.push([i - 1, j]);
          }
          if (i + 1 < l && grid[i + 1][j] === "1") {
            queue.push([i + 1, j]);
          }
          if (j - 1 >= 0 && grid[i][j - 1] === "1") {
            queue.push([i, j - 1]);
          }
          if (j + 1 < w && grid[i][j + 1] === "1") {
            queue.push([i, j + 1]);
          }
        }
      }
    }
  }
  return num;
};
/*
时间复杂度：O(MN)，其中 M 和 N 分别为行数和列数。
空间复杂度：O(min(M, N))，在最坏情况下，整个网格均为陆地，队列的大小可以达到min(M,N)。
 */

const grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
];

console.log(numIslands2(grid));
