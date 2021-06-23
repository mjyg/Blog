import { track, trigger } from './effect'
import { OperationTypes } from './operations'
import { isObject } from '@vue/shared'
import { reactive } from './reactive'
import { ComputedRef } from './computed'
import { CollectionTypes } from './collectionHandlers'

/**
 * Ref存在的原因是对基本数据的处理
 */
export interface Ref<T = any> {
  _isRef: true
  value: UnwrapRef<T>
}

const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val

export function ref<T extends Ref>(raw: T): T
export function ref<T>(raw: T): Ref<T>
export function ref<T = any>(): Ref<T>
export function ref(raw?: unknown) {
  if (isRef(raw)) {
    return raw
  }
  /**
   * 如果是对象，则用 reactive 方法 包装 raw,不是就返回原始值
   * const convert = (val: any): any => (isObject(val) ? reactive(val) : val)
   */
  raw = convert(raw)

  /**
   * 返回v，Ref类型，获取value值的时候，调用track方法，存value值时，调用 trigger方法
   * v.value触发get，v.value=2触发set
   */
  const r = {
    _isRef: true,
    get value() {
      //TODO:why track
      track(r, OperationTypes.GET, '')
      return raw
    },
    set value(newVal) {
      //对数据包装
      raw = convert(newVal)
      //TODO:why trigger
      trigger(r, OperationTypes.SET, '')
    }
  }
  return r as Ref
}

//判断是否是ref
export function isRef(r: any): r is Ref {
  return r ? r._isRef === true : false
}
/**
 * 把代理对象转换为ref
 * @param object
 */
export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {}
  for (const key in object) {
    ret[key] = toProxyRef(object, key)
  }
  return ret
}
/**
 * 转换ref数据
 * @param object
 * @param key
 */
function toProxyRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  return {
    _isRef: true,
    get value(): any {
      return object[key]
    },
    set value(newVal) {
      object[key] = newVal
    }
  }
}

// Recursively unwraps nested value bindings.
export type UnwrapRef<T> = {
  cRef: T extends ComputedRef<infer V> ? UnwrapRef<V> : T
  ref: T extends Ref<infer V> ? UnwrapRef<V> : T
  array: T extends Array<infer V> ? Array<UnwrapRef<V>> : T
  object: { [K in keyof T]: UnwrapRef<T[K]> }
}[T extends ComputedRef<any>
  ? 'cRef'
  : T extends Ref
    ? 'ref'
    : T extends Array<any>
      ? 'array'
      : T extends Function | CollectionTypes
        ? 'ref' // bail out on types that shouldn't be unwrapped
        : T extends object ? 'object' : 'ref']
