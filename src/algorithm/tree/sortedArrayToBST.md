```js
//将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 *
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

var sortedArrayToBST = function(nums) {
  debugger;
  if (nums.length === 0) return null;
  const rootIndex = (nums.length / 2) >>> 0;
  let root = new TreeNode(nums[rootIndex]);
  let cur = root;
  //生成左边树
  for (let i = rootIndex - 1; i >= 0; i--) {
    cur.left = new TreeNode(nums[i]);
    cur = cur.left;
  }

  //生成右边树
  if (rootIndex < nums.length - 1) {
    let rightTreeRoot = new TreeNode(nums[nums.length - 1]);
    cur = rightTreeRoot;
    for (let i = nums.length - 2; i > rootIndex; i--) {
      cur.left = new TreeNode(nums[i]);
      cur = cur.left;
    }
    root.right = rightTreeRoot;
  }
  return root;
};

var sortedArrayToBST2 = function(nums) {
  return generateTree(nums, 0, nums.length - 1);
};

var generateTree = function(nums, start, end) {
  if (start > end) return;
  const mid = ((end + start) / 2) >> 0;
  const root = new TreeNode(nums[mid]);
  root.left = generateTree(nums, start, mid - 1);
  root.right = generateTree(nums, mid + 1, end);
  return root;
};
console.log(sortedArrayToBST2([-10, -3, 0, 5, 9]));

```
