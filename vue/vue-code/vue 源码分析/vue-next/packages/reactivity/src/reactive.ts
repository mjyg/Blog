import { isObject, toRawType } from '@vue/shared'
import { mutableHandlers, readonlyHandlers } from './baseHandlers'
import {
  mutableCollectionHandlers,
  readonlyCollectionHandlers
} from './collectionHandlers'
import { ReactiveEffect } from './effect'
import { UnwrapRef, Ref } from './ref'
import { makeMap } from '@vue/shared'

/*
reactive: 本库的核心方法，传递一个object类型的原始数据，
通过Proxy，返回一个代理数据。在这过程中，劫持了原始数据的任何读写操作。
进而实现改变代理数据时，能触发依赖其的监听函数effect。
*/

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
//这个WeakMap储存着（target-> key->dep）,在概念上，把依赖看着Dep 类维护了一组订阅，更好理解，
//我们只是把它储存为原始set 可以减少内存开销

export type Dep = Set<ReactiveEffect>
export type KeyToDepMap = Map<any, Dep>
export const targetMap = new WeakMap<any, KeyToDepMap>()

// WeakMaps that store {raw <-> observed} pairs.
//原始数据到响应数据之间的映射
const rawToReactive = new WeakMap<any, any>()
const reactiveToRaw = new WeakMap<any, any>()
const rawToReadonly = new WeakMap<any, any>()
const readonlyToRaw = new WeakMap<any, any>()

// WeakSets for values that are marked readonly or non-reactive during
// observable creation.

const readonlyValues = new WeakSet<any>()
const nonReactiveValues = new WeakSet<any>()

const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])
const isObservableType = /*#__PURE__*/ makeMap(
  'Object,Array,Map,Set,WeakMap,WeakSet'
)

/**
 * 判断是否可以observable
 * @param value
 */
const canObserve = (value: any): boolean => {
  return (
    //不是Vue对象
    !value._isVue &&
    //不是VNode
    !value._isVNode &&
    //是Object、Array、Map、Set、WeakMap、WeakSet
    isObservableType(toRawType(value)) &&
    //没有被代理过
    !nonReactiveValues.has(value)
  )
}

// only unwrap nested ref
type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>

export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  //如果target是只读，返回这个target
  if (readonlyToRaw.has(target)) {
    return target
  }
  // target is explicitly marked as readonly by user
  //target被用户标记成了只读，那么就让他变成只读，并返回
  if (readonlyValues.has(target)) {
    return readonly(target)
  }

  /*
    { {a:1}:Proxy }
  */
  //创建响应式数据
  return createReactiveObject(
    target, //原始值
    rawToReactive, //原始值到响应数据的映射  { {a:1}:Proxy }
    reactiveToRaw, //响应数据到原始值的映射 { Proxy:{a:1} }
    mutableHandlers,
    mutableCollectionHandlers
  )
}

export function readonly<T extends object>(
  target: T
): Readonly<UnwrapNestedRefs<T>> {
  // value is a mutable observable, retrieve its original and return
  // a readonly version.
  //如果值已经是响应类型的值了，那么就取出他的原始值
  if (reactiveToRaw.has(target)) {
    target = reactiveToRaw.get(target)
  }
  //创建响应对象
  return createReactiveObject(
    target, //原始值
    rawToReadonly, //原始值到只读数据的映射
    readonlyToRaw, //只读数据到原始值的映射
    readonlyHandlers,
    readonlyCollectionHandlers
  )
}
/**
 * 创建响应类型
 * @param target
 * @param toProxy
 * @param toRaw
 * @param baseHandlers
 * @param collectionHandlers
 */
function createReactiveObject(
  target: unknown,
  toProxy: WeakMap<any, any>,
  toRaw: WeakMap<any, any>,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  //判断是否是基本元素（数字、字符串、布尔），如果是基本元素，就直接返回
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target already has corresponding Proxy
  //获取已经处理过的对象（可相应的、只读的）
  let observed = toProxy.get(target) ///原始值到响应数据的映射  { {a:1}:Proxy }
  //如果已经有了处理过的对象（可相应的、只读的），直接返回此对象
  if (observed !== void 0) {
    return observed
  }
  // target is already a Proxy
  //数据已经是一个处理过的对象（可相应的、只读的），返回
  if (toRaw.has(target)) {
    //响应数据到原始值的映射 { Proxy:{a:1} }
    return target
  }
  // only a whitelist of value types can be observed.
  //只有白名单的对象才可以被代理
  if (!canObserve(target)) {
    return target
  }
  //collectionTypes表示Set, Map, WeakMap, WeakSet的集合，判断对象是否是这几种类型，来使用不同的处理函数
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers
    : baseHandlers

  //数据处理
  observed = new Proxy(target, handlers)//{get(){},set(){}}

  toProxy.set(target, observed) //设置原始数据到处理后的数据的弱引用
  toRaw.set(observed, target) //设置处理后的数据到原始数据的弱引用

  //如果之前数据没有处理过，那么就设置target到key到Dep的引用关系
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }

  return observed
}

export function isReactive(value: unknown): boolean {
  return reactiveToRaw.has(value) || readonlyToRaw.has(value)
}

export function isReadonly(value: unknown): boolean {
  return readonlyToRaw.has(value)
}

/**
 * 获取原始数据
 * @param observed
 */
export function toRaw<T>(observed: T): T {
  return reactiveToRaw.get(observed) || readonlyToRaw.get(observed) || observed
}

/**
 * 标记数据为只读数据
 * @param value
 */
export function markReadonly<T>(value: T): T {
  readonlyValues.add(value)
  return value
}

//标记没有被处理过的数据
export function markNonReactive<T>(value: T): T {
  nonReactiveValues.add(value)
  return value
}
