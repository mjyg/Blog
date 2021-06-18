function Dep(){
  this.subs = []; //依赖项列表
}

Dep.prototype = {

  // 添加依赖
  addDep(sub){
    this.subs.push(sub)
  }
}