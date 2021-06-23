function Vue(options) {
  const { el, data } = options;
  const obeserve = new Observe(data, this); //监听data里的属性，重写get和set方法

  const root = document.getElementById(el);
  const dom = new Compile(root, this); //生成dom
  root.appendChild(dom);
}
