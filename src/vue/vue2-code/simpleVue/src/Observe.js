function Observe(data, vm) {
  for (const key of Object.keys(data)) {
    defineReactive(vm, key, data[key]);
  }
}

// 把data属性挂载到vm上，并重写get和set方法
function defineReactive(vm, key, val) {
  const dep = new Dep(); //初始化依赖

  Object.defineProperty(vm, key, {
    get() {
      if (Dep.target) {
        //避免多次调用get的时候重复添加
        dep.addDep(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      dep.notify();
    },
  });
}
