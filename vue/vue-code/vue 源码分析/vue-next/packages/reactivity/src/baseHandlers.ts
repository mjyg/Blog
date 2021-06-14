import { reactive, readonly, toRaw } from './reactive'
import { OperationTypes } from './operations'
import { track, trigger } from './effect'
import { LOCKED } from './lock'
import { isObject, hasOwn, isSymbol, hasChanged } from '@vue/shared'
import { isRef } from './ref'

const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map(key => (Symbol as any)[key])
    .filter(isSymbol)
)

/**
 * 创建proxy里面的get处理函数
 * @param isReadonly 否是是处理只读
 */
function createGetter(isReadonly: boolean) {
  /**
   * get函数
   */
  return function get(target: object, key: string | symbol, receiver: object) {
    //获取到Reflect执行的结果

    // yi={a:
    //   {
    //   b:1
    // }}
    //yi.a
    const res = Reflect.get(target, key, receiver)
    //防止key为Symbol的内置对象，比如 Symbol.iterator
    if (isSymbol(key) && builtInSymbols.has(key)) {
      return res
    }
    //如果是ref包装过的数据，直接调用Value触发get，获取值之后，再返回
    if (isRef(res)) {
      return res.value
    }
    //TODO:看着像跟踪，依赖收集，后面再看
    track(target, OperationTypes.GET, key)
    //{a:1}  `get` a
    /**
     * 对深层对象再次包装，
     * 判断内层是否是对象，不是就直接返回
     * 如果是对象，判断是否是要做只读处理，
     * 如果是只读，就调用只读
     * 不是的话，就调用
     */
    return isObject(res)
      ? isReadonly
        ? // need to lazy access readonly and reactive here to avoid
        // circular dependency
        readonly(res)
        : reactive(res)
      : res
  }

  /**
    c={
      a:{
        b{

        }
      }
    }
  */

  /**
  
    obj={
      a:{
        b:{
          c:1
        }
      }
    }
  */
}

/**
 * proxy中set方法的优化,包含只读数据的处理和响应式数据的处理
 * @param target
 * @param key
 * @param value
 * @param receiver
 */
function set(
  target: object,
  key: string | symbol,
  value: unknown,
  receiver: object
): boolean {
  //获取原始的数据
  value = toRaw(value)
  //拿到之前的老值
  const oldValue = (target as any)[key]
  //判断老数据是否是已经被ref处理过的，并且新数据没有没ref处理过
  if (isRef(oldValue) && !isRef(value)) {
    //更新老数据，并且返回
    // 如果 value 不是响应式数据，则需要将其赋值给 oldValue，调用set value，
    //如果 isObject(value) ，则会经过 reactive 再包装一次，将其变成响应式数据
    oldValue.value = value
    return true
  }
  /**
   *   key是target自己的属性
   *
   *   这个方法是解决 数组push时，会调用两次 set 的情况，比如 arr.push(1)
   *   第一次set，在数组尾部添加1
   *   第二次set，给数组添加length属性
   *   hasOwnProperty 方法用来判断目标对象是否含有指定属性。数组本身就有length的属性，所以这里是 true
   */
  const hadKey = hasOwn(target, key)
  //执行返回结果
  const result = Reflect.set(target, key, value, receiver)
  // don't trigger if target is something up in the prototype chain of original
  //target 如果只读 或者 存在于 reactiveToRaw 则不进入条件，reactiveToRaw 储存着代理后的对象
  //已经是代理之后的值了
  if (target === toRaw(receiver)) {
    //如果是原始数据原型链上自己的操作，就不触发
    /* istanbul ignore else */
    if (__DEV__) {
      const extraInfo = { oldValue, newValue: value }
      if (!hadKey) {
        trigger(target, OperationTypes.ADD, key, extraInfo)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, OperationTypes.SET, key, extraInfo)
      }
    } else {
      //属性新增，触发 ADD 枚举
      if (!hadKey) {
        trigger(target, OperationTypes.ADD, key)
      } else if (hasChanged(value, oldValue)) {
        //当新值与旧值不相等时
        // 属性修改，触发 SET 枚举
        trigger(target, OperationTypes.SET, key)
      }
    }
  }
  return result
}

//删除属性处理
function deleteProperty(target: object, key: string | symbol): boolean {
  const hadKey = hasOwn(target, key)
  const oldValue = (target as any)[key]
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey) {
    /* istanbul ignore else */
    if (__DEV__) {
      trigger(target, OperationTypes.DELETE, key, { oldValue })
    } else {
      trigger(target, OperationTypes.DELETE, key)
    }
  }
  return result
}
//查询属性处理
function has(target: object, key: string | symbol): boolean {
  const result = Reflect.has(target, key)
  track(target, OperationTypes.HAS, key)
  return result
}
//获取key的属性处理
function ownKeys(target: object): (string | number | symbol)[] {
  track(target, OperationTypes.ITERATE)
  return Reflect.ownKeys(target)
}

//可变数据处理handler
export const mutableHandlers: ProxyHandler<object> = {
  get: createGetter(false),
  set,
  deleteProperty,
  has,
  ownKeys
}

//只读数据handler
export const readonlyHandlers: ProxyHandler<any> = {
  //创建get
  get: createGetter(true),
  //创建set
  set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    //判断是否已经锁住
    if (LOCKED) {
      if (__DEV__) {
        console.warn(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        )
      }
      return true
    } else {
      return set(target, key, value, receiver)
    }
  },

  deleteProperty(target: object, key: string | symbol): boolean {
    if (LOCKED) {
      if (__DEV__) {
        console.warn(
          `Delete operation on key "${String(
            key
          )}" failed: target is readonly.`,
          target
        )
      }
      return true
    } else {
      return deleteProperty(target, key)
    }
  },

  has,
  ownKeys
}
