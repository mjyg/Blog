let uid = 0
let batcher

function Watcher(vm, node, name, type) {
  Dep.target = this;
  this.vm = vm;
  this.id = ++uid;
  this.node = node;
  this.name = name;
  this.type = type;
  this.update();

  // 清空target,避免observe里get的时候重复添加到subs
  Dep.target = null;
}

Watcher.prototype = {
  // 调用批处理方法
  update() {
    this.get();
    if(!batcher) {
      batcher = new Batcher()
    }
    batcher.push(this)
  },

  // 获取vm里的属性，
  get() {
    this.value = this.vm[this.name]; //触发observe里面定义的get方法
  },

  // 更新dom
  cb(){
    console.log('更新dom')
    this.node[this.type] = this.value;
  }
};
