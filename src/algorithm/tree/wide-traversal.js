/*
a、自定义多叉树节点node结构（只需要定义节点结构即可，无需构建树）
b、按照广度优先查找符合要求的节点（没有符合要求的节点返回null），比如查找电话号码为 phone的用户信息，调用如下：
let node = wideTraversal(node,(e)=>e.phone===phone)
 */

const tree = {
  phone: 11,
  children: [
    {
      name: 'a',
      phone: 21,
      children: [
        {
          name: 'd',
          phone: 31,
        },
        {
          name: 'e',
          phone: 32,
        },
      ],
    },
    {
      name: 'b',
      phone: 22,
    },
    {
      name: 'c',
      phone: 32,
    },
  ],
};

function wideTraversal(node, func) {
  const queue = [];
  queue.push(node);
  while (queue.length) {
    const item = queue.shift();
    if (func(item)) {
      return item;
    } else {
      if (item.children) {
        queue.push(...item.children);

      }
    }
  }
  return null;
}

console.log(wideTraversal(tree, (node) => node.phone === 32));  // { name: 'c', phone: 32 }

