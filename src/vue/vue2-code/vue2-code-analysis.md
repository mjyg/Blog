# vue2双向绑定源码分析

先看src/core/observer/index.js：
```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // 把该对象作为root $data的vm个数

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)   // 添加__ob__来标示value有对应的Observer

    if (Array.isArray(value)) {
      // 处理数组
      if (hasProto) {  //是否有原型链
        protoAugment(value, arrayMethods)   //value的原型置为arrayMethods
      } else {
        copyAugment(value, arrayMethods, arrayKeys) // 把arrayMethods上的方法定义到value上
      }
      this.observeArray(value)
    } else {
      // 处理对象
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    // 给每个属性添加getter/setters
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    // 观察数组的每一项
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```
Observer会观察两种类型的数据，Object 与 Array 

对于Array类型的数据，由于 JavaScript 的限制， Vue 不能检测变化,会先重写操作数组
的原型方法，重写后能达到两个目的
 
当数组发生变化时，触发 notify <br>
如果是 push，unshift，splice 这些添加新元素的操作，则会使用observer观察新添加的
数据 

重写完原型方法后，遍历拿到数组中的每个数据 使用observer观察它  <br>
而对于Object类型的数据，则遍历它的每个key，使用 defineProperty 设置 getter 和 
setter，当触发getter的时候，observer则开始收集依赖，而触发setter的时候，observe
则触发notify。

defineReactive函数：
```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {  //触发get时，收集依赖
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()  // 添加依赖
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()  // 更新watcher
    }
  })
}
```
通过Object.defineProperty，添加依赖和更新watcher<br>
在getter中，将Dep.target添加到dep内部的subs<br>
在setter中，如果新旧值相同，直接返回，不同则调用dep.notify来更新与之相关的watcher。

observe函数：
```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)  //如果是对象，继续observer
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```
该方法用于观察一个对象，返回与对象相关的Observer对象，如果没有则为value创建一个对应的Observer。
defineReactive中调用该方法，其实就是为所有value为对象的值递归地观察。

我们再回到Observer，如果传入的是对象，我们就调用walk，该方法就是遍历对象，对每个值执行defineReactive。

另一种情况是传入的对象是数组，因为数组本身只引用了一个地址，所以对数组进行push、splice、sort等操作，
我们是无法监听的。所以，Vue中改写value的__proto__（如果有），或在value上重新定义这些方法。
augment在环境支持__proto__时是protoAugment，不支持时是copyAugment。
```js
/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object) {
  // 执行了value.__proto__ = arrayMethods
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  // 循环把arrayMethods上的arrayKeys方法添加到value上
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
下面看src/core/observer/array.js：<br>
arrayMethods其实是改写了数组方法的新对象。arrayKeys是arrayMethods中的方法列表
```js
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
```
整体上其实还是调用数组相应的方法来操作value，只不过操作之后，添加了相关watcher的更新。
这里解释一下为什么push、unshift、splice参数大于2时，要重新调用ob.observeArray，
因为这三种情况都是向数组中添加新的元素，所以需要重新观察每个子元素。

下面看src/core/observer/dep.js：<br>
```js
/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {  //添加watcher(具体要做的事情)添加到依赖
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {  //循环所有电话，通知watcher
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```
Dep对象，内部有一个为一个id，用于作为Dep对象的唯一标识，还有一个保存watcher的数组subs。<br>
removeSub是从数组中移除某一watcher，depend是调用了watcher的addDep

