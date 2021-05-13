var preOrder = function(root) {
  // 非递归先序遍历（中左右）：先遍历左子树，并入栈,入栈的时候打印；当左子树为空的时候，pop栈顶元素，
  // 遍历其右子树；当右子树为空且栈为空时退出循环，遍历结束
  let node = root;
  const stack = []
  while(node || stack.length) {
    while(node) {
      console.log(node.val)
      stack.push(node)
      node = node.left
    }
    node = stack.pop()
    node = node.right
  }
}

const preOrder2 = function(root) {
  // 递归先序遍历
  if (root){
    console.log(root.val)
    preOrder2(root.left)
    preOrder2(root.right)
  }
}

var middleOrder = function (root) {
  // 非递归中序遍历（左中右）：遍历左子树入栈，当左子树为空时，Pop栈顶元素，打印，遍历其右子树；
  // 当右子树为空且栈为空时退出循环，遍历结束
  let node = root;
  const stack = []
  while(node || stack.length) {
    while(node) {
      stack.push(node)
      node = node.left
    }
    node = stack.pop()
    console.log(node.val)
    node = node.right;
  }
};

var middleOrder2 = function(root) {
  //递归中序遍历
  if(root) {
    middleOrder2(root.left)
    console.log(root.val)
    middleOrder2(root.right)
  }
}

const postOrder = function(root) {
  // 递归后序遍历
  if(root) {
    postOrder(root.left)
    postOrder(root.right)
    console.log(root.val)
  }
}

const root = {
  val:4,
  left:{
    val:2,
    left:{
      val:1,
    },
    right:{
      val:3
    }
  },
  right: {
    val:6
  }
}

console.log(preOrder(root))
console.log(middleOrder(root))
console.log(postOrder(root))
