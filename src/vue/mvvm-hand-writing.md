# 手写MVVM实现Vue的双向绑定
先创建一个普通的使用Vue的index.html:
```html
<!DOCTYPE html>
<head></head>
<body>
  <div id="app">
    <input type="text" id="a" v-model="text">
    {{text}}
  </div>
  <script>
    window.batcher = "";
  </script>
  <script src="src/Batcher.js"></script>
  <script src="src/Dep.js"></script>
  <script src="src/Observe.js"></script>
  <script src="src/Watcher.js"></script>
  <script src="src/Compile.js"></script>
  <script src="src/MVVM.js"></script>
  <script>
    var vm = new Vue({
      el: 'app',
      data: {
        text: 'hello world'
      }
    });
    for(var i=0;i<100;i++){
      vm["text"] = i;
    }
  </script>
</body>
</html>
```
创建MVVM.js，定义vue的构造函数，如下：
 ```js
//vue构造函数
/**
{
    el: 'app',
    data: {
      text: 'hello world'
    }
  }
 */
function Vue(options) {
  this.data = options.data; //{text: 'hello world'} 数据挂载到实例上面去
  var data = this.data;
  observe(data, this); //监听数据 get、set （没有触发）
  var id = options.el; //app

  /**
     <input type="text" id="a" v-model="text">
    {{text}}
  */
  var dom = new Compile(document.getElementById(id), this);
  document.getElementById(id).appendChild(dom);
}
``` 
创建Observe.js,定义observe方法，拦截data里每个属性的get和set方法，在get的时候把他们加到Dep(依赖)中，
在set的时候：
```js
/**
 obj:{text: 'hello world'}
 vm: vue实例
 */
function observe(obj, vm) {
  Object.keys(obj).forEach(function (key) {
    //text
    defineReactive(vm, key, obj[key]);
  });
}

//vue实例、  text ，'hello world'
function defineReactive(vm, key, val) {
  var dep = new Dep(); //初始化依赖收集的过程
  Object.defineProperty(vm, key, {
    get: function () {
      if (Dep.target) {
        //watcher
        dep.addSub(Dep.target); //Dep.target==?watcher
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); //通知watcher
    },
  });
}
```