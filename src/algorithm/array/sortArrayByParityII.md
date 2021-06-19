```js
/*
给定一个非负整数数组 A， A 中一半整数是奇数，一半整数是偶数。
对数组进行排序，以便当 A[i] 为奇数时，i 也是奇数；当 A[i] 为偶数时， i 也是偶数。
你可以返回任何满足上述条件的数组作为答案。
示例：
输入：[4,2,5,7]
输出：[4,5,2,7]
解释：[4,7,2,5]，[2,5,4,7]，[2,7,4,5] 也会被接受。
提示：
2 <= A.length <= 20000
A.length % 2 == 0
0 <= A[i] <= 1000
 */
/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParityII = function(A) {
  if (!A.length) return A;
  let i = 0; //偶数指针
  let j = 1; //奇数指针

  while (j < A.length && i < A.length) {
    while (A[i] % 2 === 0 && i < A.length) i += 2;
    while (A[j] % 2 !== 0 && j < A.length) j += 2;
    if (j < A.length && i < A.length) swap(A, i, j);
  }
  return A;
};

function swap(A, i, j) {
  const temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

console.log(sortArrayByParityII([3, 4]));

```
