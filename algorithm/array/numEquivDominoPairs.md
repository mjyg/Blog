```js
/*
给你一个由一些多米诺骨牌组成的列表 dominoes。
如果其中某一张多米诺骨牌可以通过旋转 0 度或 180 度得到另一张多米诺骨牌，我们就认为这两张牌是等价的。
形式上，dominoes[i] = [a, b] 和 dominoes[j] = [c, d] 等价的前提是 a==c 且 b==d，或是 a==d 且 b==c。
在 0 <= i < j < dominoes.length 的前提下，找出满足 dominoes[i] 和 dominoes[j] 等价的骨牌对 (i, j) 的数量。
示例：
输入：dominoes = [[1,2],[2,1],[3,4],[5,6]]
输出：1
 */

/**
 * @param {number[][]} dominoes
 * @return {number}
 */
var numEquivDominoPairs = function (dominoes) {
  const arr = [];
  let re = 0;
  for (const d of dominoes) {
    const num = d[0] > d[1] ? d[0] * 10 + d[1] : d[1] * 10 + d[0];
    if (arr[num] === undefined) arr[num] = 0;
    re += arr[num];
    arr[num]++;
  }
  return re;
};

console.log(numEquivDominoPairs([[1, 1], [1, 1], [1, 2], [1, 2], [1, 1]]));

```
