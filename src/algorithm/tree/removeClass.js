/*
移除dom树上面的class属性
 */

const baseRoot = {
  tagName: 'div',
  children: [
    'this is a span',
    {
      tagName: 'span',
      children: [
        'hello world!',
        {
          tagName: 'input',
          children: ['this is a input'],
          attribute: [
            {
              key: 'class',
              value: 'Input',
            },
            {
              key: 'value',
              value: 'something',
            },
          ],
        },
      ],
      attribute: [
        {
          key: 'style',
          value: 'xxx',
        },
      ],
    },
  ],
  attribute: [
    {
      key: 'class',
      value: 'button',
    },
    {
      key: 'data-text',
      value: 'demo',
    },
  ],
};
const resultRoot = {
  tagName: 'div',
  children: [
    'this is a span',
    {
      tagName: 'span',
      children: [
        'hello world!',
        {
          tagName: 'input',
          children: ['this is a input'],
          attribute: [
            {
              key: 'value',
              value: 'something',
            },
          ],
        },
      ],
      attribute: [
        {
          key: 'style',
          value: 'xxx',
        },
      ],
    },
  ],
  attribute: [
    {
      key: 'data-text',
      value: 'demo',
    },
  ],
};

// 借助队列，使用层次遍历
function removeClass(root) {
  let queue = [root];
  while (queue.length) {
    const node = queue.shift();

    // 处理当前节点
    if (node.attribute) {
      for (let i = 0; i < node.attribute.length; i++) {
        const { key } = node.attribute[i];
        if (key === 'class') node.attribute.splice(i, 1);
      }
    }

    // 孩子节点入队列
    node.children && (queue = queue.concat(node.children));
  }

  return root;
}

console.log(removeClass(baseRoot));
