//给两个二叉树，如何确定两个二叉树完全相同

const root1 = {
  value: 1,
  left:{
    value:2
  },
  right: {
    value: 1,
  },
};

const root2 = {
  value: 1,
  left:{
    value:1
  },
  right: {
    value: 2,
  },
};

// 广度遍历
function isSameTree(root1, root2) {
  const queue1 = [];
  const queue2 = [];
  queue1.push(root1);
  queue2.push(root2);

  while (queue1.length && queue2.length) {
    const node1 = queue1.shift();
    const node2 = queue2.shift();
    if (node1.value !== node2.value) return false;
    if (node1.value !== node2.value) return false;

    const left1 = node1.left,
      left2 = node2.left,
      right1 = node1.right,
      right2 = node2.right;

    if ((left1 === null) ^ (left2 === null)) return false;
    if ((right1 === null) ^ (right2 === null)) return false;

    if (left1) queue1.push(left1);
    if (right1) queue1.push(right1);

    if (left2) queue2.push(left2);
    if (right2) queue2.push(right2);
  }

  return !(queue1.length || queue2.length);
}

// 深度遍历
function isSameTree2(root1, root2) {
  if (!root1 && !root2) return true;  //两个都不存在，返回true
  if (!root1 || !root2) return false;  // 只有一个不存在，返回false
  if (root1.value !== root2.value) return false;  //两个都存在但是值不相等，返回false
  return isSameTree2(root1.left, root2.left) && isSameTree2(root1.right, root2.right);
}

console.log(isSameTree2(root1, root2));
