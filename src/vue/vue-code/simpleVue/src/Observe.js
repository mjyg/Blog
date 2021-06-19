function Observe(data, vm){
  for(const key of Object.keys(data)) {
    defineReactive(vm,key,data[key])
  }
}

// 把data属性挂载到vm上，并重写get和set方法
function defineReactive(vm, key, val) {

  const dep = new Dep()  //初始化依赖

  Object.defineProperty(vm,key, {
    get(){
      dep.push()
      return val
    },
    set(newVal){
      val = newVal
    }
  })

}