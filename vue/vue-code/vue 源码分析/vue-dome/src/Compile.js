


/**
   <input type="text" id="a" v-model="text">
  {{text}}


  vue实例VM
*/
function Compile(node, vm) {

  if (node) {

    this.$frag = this.nodeToFragment(node, vm);

    return this.$frag;
  }
}
Compile.prototype = {

  /**
    <input type="text" id="a" v-model="text">
   {{text}}


   vue实例VM
 */
  nodeToFragment: function (node, vm) {
    var self = this;
    var frag = document.createDocumentFragment();//创建文档片段，不会真实操作dom，存在于内存中
    var child;

    /**
     <input type="text" id="a" v-model="text">
    {{text}}
    **/

    while (child = node.firstChild) {

      self.compileElement(child, vm);// <input type="text" id="a" v-model="text">

      frag.append(child);
    }

    return frag;
  },
  compileElement: function (node, vm) {
    var reg = /\{\{(.*)\}\}/;

    //判断元素节点
    if (node.nodeType === 1) {
      //<input type="text" id="a" v-model="text">
      var attr = node.attributes;
      // 解析属性
      for (var i = 0; i < attr.length; i++) {

        if (attr[i].nodeName == 'v-model') {
          var name = attr[i].nodeValue;//text

          node.addEventListener('input', function (e) {
            vm[name] = e.target.value;
          });

          new Watcher(vm, node, name, 'value');
        }
      };
    }


    //{{text}}
    //判断文本节点
    if (node.nodeType === 3) {

      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1;//text
        name = name.trim();
        // node.nodeValue = vm[name];

        new Watcher(vm, node, name, 'nodeValue');
      }
    }
  },
}

