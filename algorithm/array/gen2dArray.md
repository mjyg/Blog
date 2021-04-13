```js
//深度优先搜索DFS

//生成二维数组
function gen2dArray(x, y) {
  const arr = new Array(x).fill(0);
  for (let i = 0; i < x; i++) {
    arr[i] = new Array(y).fill(0);
  }
  return arr;
}

const goalX = 0,
  goalY = 3;
const n = 5,
  m = 5;
const graph = gen2dArray(n, m);
const used = gen2dArray(n, m);

//通过px和py的数组来实现左下右上的移动顺序
const px = [0, 1, 0, -1];
const py = [-1, 0, 1, 0];

let path = 1; //记录路线

function DFS(graph, used, x, y) {
  //当前坐标与目标相同，则成功
  if (x === goalX && y === goalY) {
    console.log('DFS找到目标');
    console.log('路线图：', used);
    return;
  }

  //遍历四个方向
  for (let i = 0; i < 4; i++) {
    const newX = x + px[i];
    const newY = y + py[i];
    if (newX >= 0 && newX < n && newY >= 0 && newY < m && !used[newX][newY]) {
      used[newX][newY] = path++; //将格子设为走过
      DFS(graph, used, newX, newY); //继续下一个格子
    }
  }
}

// 广度优先搜索BFS
function BFS(graph, used, x, y) {
  used[x][y] = path++;
  //当前坐标与目标相同，则成功
  if (x === goalX && y === goalY) {
    console.log('BFS找到目标');
    console.log('路线图：', used);
    return;
  }
  const queue = [];
  queue.push([x, y]); //起点入队
  while (queue.length) {
    const [a, b] = queue.pop();

    //遍历四个方向
    for (let i = 0; i < 4; i++) {
      const newX = a + px[i];
      const newY = b + py[i];
      if (newX >= 0 && newX < n && newY >= 0 && newY < m && !used[newX][newY]) {
        used[newX][newY] = path++; //将格子设为走过

        //当前坐标与目标相同，则成功
        if (newX === goalX && newY === goalY) {
          console.log('找到目标');
          console.log('路线图：', used);
          return;
        } else {
          queue.unshift([newX, newY]); //把该格子入队
        }
      }
    }
  }
  console.log(used);
}

used[0] = [-1, 0, 0, 0, 0]; //设置墙壁，-1的点表示不能走的点
used[1] = [0, 0, 0, 0, 0];

// DFS(graph, used, 0, 4);
BFS(graph, used, 4, 0);

```
