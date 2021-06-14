function Dep() {
  this.subs = [];//电话本
}
Dep.prototype = {
  //往数组添加依赖  sub
  addSub: function (sub) {
    this.subs.push(sub);  //watcher??
  },
  //通知 watcher update
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    })
  }
}



