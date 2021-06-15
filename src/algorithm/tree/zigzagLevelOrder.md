```js
/*
给定一个二叉树，返回其节点值的锯齿形层序遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）
 */
/**
 * Definition for a binary tree node.
 *
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

var zigzagLevelOrder2 = function(root) {
  if (!root) {
    return [];
  }

  const ans = [];
  const nodeQueue = [root];

  let isOrderLeft = true;

  while (nodeQueue.length) {
    const levelList = [];
    const len = nodeQueue.length; //每一层的长度
    //遍历每一层
    for (let i = 0; i < len; i++) {
      const node = nodeQueue.pop();
      if (isOrderLeft) {
        levelList.push(node.val);
      } else {
        levelList.unshift(node.val);
      }
      if (node.left) nodeQueue.unshift(node.left);
      if (node.right) nodeQueue.unshift(node.right);
    }
    ans.push(levelList);
    isOrderLeft = !isOrderLeft;
  }

  return ans;
};

const root = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: null,
  },
  right: {
    val: 3,
    right: {
      val: 5,
    },
    left: null,
  },
};

console.log(zigzagLevelOrder2(root));

```
