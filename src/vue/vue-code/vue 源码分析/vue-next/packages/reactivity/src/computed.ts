import { effect, ReactiveEffect, effectStack } from './effect'
import { Ref, UnwrapRef } from './ref'
import { isFunction, NOOP } from '@vue/shared'
/**
computed: 计算数据，接受一个getter函数或者包含get/set行为的对象，返回一个响应式的数据。
它若有变更，也会触发reactiveEffect。
*/
export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: UnwrapRef<T>
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = () => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>
  //传入函数
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  let dirty = true
  let value: T

  //effect 方法不会立即执行，在 get 时执行
  const runner = effect(getter, {
    lazy: true,
    // mark effect as computed so that it gets priority during trigger
    computed: true,
    scheduler: () => {
      //在触发set时，触发trigger-->触发scheduler
      dirty = true
    }
  })
  return {
    _isRef: true,
    // expose effect so computed can be stopped
    //导出了 runner 让 computed 可以被外部暂停
    effect: runner,
    get value() {
      /**
       * computed返回ref，
       * ref的get执行effect方法，执行完毕后dirty变成了false，
       * 只有响应对象trigger之后，dirty才会变回来为true，
       */
      if (dirty) {
        value = runner()
        dirty = false
      }
      // When computed effects are accessed in a parent effect, the parent
      // should track all the dependencies the computed property has tracked.
      // This should also apply for chained computed properties.
      trackChildRun(runner)
      return value
    },
    set value(newValue: T) {
      setter(newValue)
    }
  }
}

function trackChildRun(childRunner: ReactiveEffect) {
  if (effectStack.length === 0) {
    return
  }
  const parentRunner = effectStack[effectStack.length - 1]
  for (let i = 0; i < childRunner.deps.length; i++) {
    const dep = childRunner.deps[i]
    if (!dep.has(parentRunner)) {
      dep.add(parentRunner)
      parentRunner.deps.push(dep)
    }
  }
}
