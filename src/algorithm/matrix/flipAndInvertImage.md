```js
/*
832. 翻转图像
给定一个二进制矩阵 A，我们想先水平翻转图像，然后反转图像并返回结果。
水平翻转图片就是将图片的每一行都进行翻转，即逆序。例如，水平翻转 [1, 1, 0] 的结果是 [0, 1, 1]。
反转图片的意思是图片中的 0 全部被 1 替换， 1 全部被 0 替换。例如，反转 [0, 1, 1] 的结果是 [1, 0, 0]。
*/
/*
输入: [[1,1,0],[1,0,1],[0,0,0]]
输出: [[1,0,0],[0,1,0],[1,1,1]]
解释: 首先翻转每一行: [[0,1,1],[1,0,1],[0,0,0]]；
     然后反转图片: [[1,0,0],[0,1,0],[1,1,1]]
 */

// 解法1：依次遍历矩阵中的元素，对于每行元素，首位元素交换，交换的同时和1做异或运算
// 异或运算：不带进位的加法运算，当且仅当只有一个表达式的某位上为 1 时，结果的该位才为 1。否则结果的该位为 0。
// 1^1为0,0^1为1
/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var flipAndInvertImage = function (A) {
  for (const arr of A) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const temp = arr[left] ^ 1;
      arr[left] = arr[right] ^ 1;
      arr[right] = temp;
      left++;
      right--;
    }
  }
  return A;
};

// 解法2：和上面思想一样
function flipAndInvertImage2() {
  const row = A.length;
  const col = A[0].length;
  for (let i = 0; i < row; i++) {
    let left = 0;
    let right = col - 1;
    while (left <= right) {
      [A[i][left], A[i][right]] = [A[i][right] ^ 1, A[i][left] ^ 1];
      left++;
      right--;
    }
  }
  return A;
}

// 两种解法时间复杂度为O(n*n),空间复杂度为O(1)

console.log(
  flipAndInvertImage([
    [1, 1, 0],
    [1, 0, 1],
    [0, 0, 0],
  ])
);

```
