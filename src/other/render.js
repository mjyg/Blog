// 写一个函数实现虚拟dom转化为真实dom，虚拟dom：{tag：'',attr:{},children:[]})
function render(props) {
  const { tag, attr, children } = props;
  const e = document.createElement(tag);

  // 设置attr
  for (const key of Object.keys(attr)) {
    e.setAttribute(key, attr[key]);
  }

  // 设置子节点
  for (const item of children) {
    const ch = typeof item === 'string' ? document.createTextNode(item) : render(item);
    e.appendChild(ch);
  }
  return e;
}

const ch = { tag: 'div', attr: { class: 'aa' }, children: ['11'] };
document.body.appendChild(render({ tag: 'div', attr: { id: 1 }, children: [ch, '22'] }));
