const rawToReactive = new WeakMap() //原始数据到可响应数据的映射 val==>Reactive
const reactiveToRaw = new WeakMap() //可响应数据到原始数据的映射 Reactive==>val

/**
 * 判断是否是对象
 * @param val
 */
// utils
function isObject(val) {
  return typeof val === 'object'
}

/**
 * 判断属性是否是对象自己的
 * @param val
 * @param key
 */
function hasOwn(val, key) {
  const hasOwnProperty = Object.prototype.hasOwnProperty
  return hasOwnProperty.call(val, key)
}

/**
 * 创建getter函数的过程,getter函数
 */
function createGetter() {
  /**
   * get函数重写
   */
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    //返回的res是内部引用的数据，判断返回的数据是否是对象，如果是对象，变成响应式数据
    return isObject(res) ? reactive(res) : res
  }
}

/**
 * setter 函数设置
 * @param target
 * @param key
 * @param val
 * @param receiver
 */
function set(target, key, val, receiver) {
  const hadKey = hasOwn(target, key) //设置值的key是否已经设置过
  const oldValue = target[key] //获取老数据

  val = reactiveToRaw.get(val) || val //获取是否映射
  const result = Reflect.set(target, key, val, receiver)

  if (!hadKey) {
    //没有设置过数据，通知回调
    console.log('trigger ...')
  } else if (val !== oldValue) {
    console.log('trigger ...')
  }

  return result
}

/**
 * handler函数
 */
const mutableHandlers = {
  get: createGetter(),
  set: set
}

/**
 * 入口函数，把原始数据变成响应类型
 * @param target
 * @return
 */
function reactive(target) {
  return createReactiveObject(
    target,
    rawToReactive,
    reactiveToRaw,
    mutableHandlers
  )
}
/**
 * 创建可响应对象
 * @param target 原始数据
 * @param toProxy 原始数据到响应对象的映射
 * @param toRaw 响应对象到原始数据的映射
 * @param baseHandlers handler处理函数，包含get、set等traps
 */
function createReactiveObject(target, toProxy, toRaw, baseHandlers) {
  let observed = toProxy.get(target) //获取observed已经响应的数据

  // 原数据已经有相应的可响应数据, 返回可响应数据
  if (observed !== void 0) {
    return observed
  }
  // 原数据已经是可响应数据，直接返回
  if (toRaw.has(target)) {
    return target
  }

  //数据变成响应式数据
  observed = new Proxy(target, baseHandlers)
  toProxy.set(target, observed) //设置原始数据到响应数据的映射
  toRaw.set(observed, target) //设置响应数据到原始数据的映射
  return observed //返回响应数据
}
