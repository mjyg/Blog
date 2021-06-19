/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)  //新对象继承了数组构造方法的原型对象

//对数组需要重写的方法（会造成移位，修改数组内部变化）
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]  //获取该方法的原始方法
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)  //拿到结果
    const ob = this.__ob__
    let inserted  //新增项
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)  //新增项，重新处理响应数据
    // notify change
    ob.dep.notify()  //触发视图更新
    return result
  })
})
