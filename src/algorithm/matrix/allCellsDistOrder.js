/*
给出 R 行 C 列的矩阵，其中的单元格的整数坐标为 (r, c)，满足 0 <= r < R 且 0 <= c < C。
另外，我们在该矩阵中给出了一个坐标为 (r0, c0) 的单元格。
返回矩阵中的所有单元格的坐标，并按到 (r0, c0) 的距离从最小到最大的顺序排，其中，两单元格(r1, c1) 和
 (r2, c2) 之间的距离是曼哈顿距离，|r1 - r2| + |c1 - c2|。（你可以按任何满足此条件的顺序返回答案。）
示例 1：
输入：R = 1, C = 2, r0 = 0, c0 = 0
输出：[[0,0],[0,1]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1]
示例 2：
输入：R = 2, C = 2, r0 = 0, c0 = 1
输出：[[0,1],[0,0],[1,1],[1,0]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1,1,2]
[[0,1],[1,1],[0,0],[1,0]] 也会被视作正确答案。
示例 3：
输入：R = 2, C = 3, r0 = 1, c0 = 2
输出：[[1,2],[0,2],[1,1],[0,1],[1,0],[0,0]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1,1,2,2,3]
其他满足题目要求的答案也会被视为正确，例如 [[1,2],[1,1],[0,2],[1,0],[0,1],[0,0]]。
*/

//方案一：使用广度优先遍历算法,从出发点开始，用一个队列存放最近的点（初始存放出发点），遵循下右上左的顺序，依次遍历和对
//头元素最近的点入队，已经遍历过的点要打上标记，防止重复遍历，直到队列为空
/**
 * @param {number} R
 * @param {number} C
 * @param {number} r0
 * @param {number} c0
 * @return {number[][]}
 */
var allCellsDistOrder = function (R, C, r0, c0) {
  //模拟移动方位，顺序：下右上左
  const moveX = [0, 1, 0, -1];
  const moveY = [1, 0, -1, 0];

  //初始化标记矩阵
  let flagArr = [];
  for (let i = 0; i < R; i++) {
    const row = new Array(C).fill(0);
    flagArr.push(row);
  }

  let flag = 1;
  flagArr[r0][c0] = flag++; //初始点标记为已经入队，不需要再次入队
  let queue = [];
  queue.push([r0, c0]);
  let re = [];
  while (queue.length) {
    const item = queue.shift();
    re.push(item);

    // 和上一个点(item)距离为1的点入队
    for (let i = 0; i < 4; i++) {
      const x = item[0] + moveX[i];
      const y = item[1] + moveY[i];
      if (x >= 0 && y >= 0 && x < R && y < C && !flagArr[x][y]) {
        queue.push([x, y]);
        flagArr[x][y] = flag++; //标记新的点已经入队，不需要再次入队
      }
    }
  }
  console.log(flagArr);  //[ [ 6, 5, 3 ], [ 4, 2, 1 ] ] flagArr还可以显示遍历的轨迹
  return re;
};

//方案二：先求出所有点的距离，再按距离排序
var allCellsDistOrder2 = function (R, C, r0, c0) {
  function getDist(x, y) {
    return Math.abs(r0 - x) + Math.abs(c0 - y);
  }

  function swap(nums, i, j) {
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
  }

  //求距离
  const dist = [];
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      dist.push([i, j, getDist(i, j)]);
    }
  }

  //对dist进行排序（冒泡排序：每趟遍历依次把大的点和后续的点交换，放到后面，直到全部有序）
  for (let i = 0; i < dist.length; i++) {
    for (let j = 0; j < dist.length - i - 1; j++) {
      if (dist[j][2] > dist[j + 1][2]) swap(dist, j, j + 1);
    }
    dist[dist.length - i - 1].pop();
  }
  return dist;
};


console.log(allCellsDistOrder(2, 3, 1, 2));


// 上面两个算法时间复杂度和空间复杂度应该都是O(n*n)
