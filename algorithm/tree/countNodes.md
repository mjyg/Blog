```js
//给出一个完全二叉树，求出该树的节点个数。

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
//方法一：广度遍历
var countNodes = function (root) {
  if (!root) return 0;
  let count = 0;
  const queue = [];
  queue.push(root);
  while (queue.length) {
    const node = queue.pop();
    count++;
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }
  return count;
};

//方法二：深度遍历
var countNodes2 = function (root) {
  return root ? countNodes2(root.left) + countNodes2(root.right) + 1 : 0;
};

//方法三：通过树的深度判断左右子树是否为完全二叉树，如果是完全二叉树，则用公式算节点数

function treeHeight(root) {
  return root ? treeHeight(root.left) + 1 : 0;
}

var countNodes3 = function (root) {
  let count = 0;
  let height = treeHeight(root); //树的高度
  console.log('height',height)

  if(height === 0 || height === 1)
    return height;

  if (treeHeight(root.right) + 1 === height) {
    //右子树的高度和树的高度相等，则左子树为完全二叉树
    count = (1 << (height - 1)) + countNodes3(root.right);
  } else {
    //右子树为完全二叉树
    count = (1 << (height - 2))  + countNodes3(root.left);
  }
  return count;
};

const tree = {
  val: 1,
  left: {
    val: 2,
    right: null,
    left: {
      val: 4,
      left: null,
    },
  },
  right: {
    val: 3,
    left: null,
  },
};

console.log(countNodes3(tree));

```
