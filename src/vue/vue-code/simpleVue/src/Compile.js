function Compile(node, vm){
 if(node) {
   return this.nodeToFragment(node, vm)
 }
}

Compile.prototype={
  // 把节点转成dom
  nodeToFragment(node,vm){
    const fragment = document.createDocumentFragment()  //创建文档片段再一次性加到dom中

    let children
    while (children = node.firstChild) {
      this.compileElement(children,vm)
      fragment.append(children)  //每次append会把children从原来的dom摘除放入内存中
    }
    return fragment;
  },

  // 处理每一个节点
  compileElement(node,vm){
    const reg = /\{\{(.*)\}\}/

    // 处理元素节点
    if(node.nodeType === 1) {
      const attr = node.attributes
      for(const item of attr) {
        const {nodeName, nodeValue} = item
        if(nodeName === 'v-model'){
          node.addEventListener('input', function(e){
            vm[nodeValue] = e.target.value  //修改vm的属性，触发observe里面定义的set方法
            console.log('vue实例：', vm)
          })
        }
      }
    }

    // 处理文本节点
    if(node.nodeType === 3) {
      if(reg.test(node.nodeValue)) {
        const name = RegExp.$1.trim();
        node.nodeValue = vm[name]  //取vm里的属性，触发observe里面定义的get方法
      }
    }
  }
}

