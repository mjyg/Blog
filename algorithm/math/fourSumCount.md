```js
/*
给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0。
为了使问题简单化，所有的 A, B, C, D 具有相同的长度 N，且 0 ≤ N ≤ 500 。所有整数的范围在 -228 到 228 - 1 之间，最终结果不会超过 231 - 1 。
*/
/*
例如:
输入:
A = [ 1, 2]
B = [-2,-1]
C = [-1, 2]
D = [ 0, 2]
输出:
2
解释:
两个元组如下:
1. (0, 0, 0, 1) -> A[0] + B[0] + C[0] + D[1] = 1 + (-2) + (-1) + 2 = 0
2. (1, 1, 0, 0) -> A[1] + B[1] + C[0] + D[0] = 2 + (-1) + (-1) + 0 = 0
 */
/**
 * @param {number[]} A
 * @param {number[]} B
 * @param {number[]} C
 * @param {number[]} D
 * @return {number}
 */
//先遍历AB数组，求出他们的和，以及和的计数；再遍历CD，求出他们的和在AB和的计数里是否能相加为0
// 时间复杂度为O（n^2），控件复杂度最坏为O（n^2）
var fourSumCount = function(A, B, C, D) {
  let count = 0;
  let re = new Map(); //Map比Object在添加和删除属性方面效率高很多
  for (let a = 0; a < A.length; a++) {
    for (let b = 0; b < B.length; b++) {
      re.set((i = A[a] + B[b]), (re.get(i) || 0) + 1);
    }
  }
  for (let a = 0; a < C.length; a++) {
    for (let b = 0; b < D.length; b++) {
      if (re.has((j = 0 - (C[a] + D[b])))) {
        count += re.get(j);
      }
    }
  }
  return count;
};

const A = [1, 2],
  B = [-2, -1],
  C = [-1, 2],
  D = [0, 2];

console.log(fourSumCount([-1, -1], [-1, 1], [-1, 1], [1, -1]));

```
