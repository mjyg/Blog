import { OperationTypes } from './operations'
import { Dep, targetMap } from './reactive'
import { EMPTY_OBJ, extend } from '@vue/shared'

export const effectSymbol = Symbol(__DEV__ ? 'effect' : void 0)
/**
 * effect：接受一个函数，返回一个新的监听函数 reactiveEffect 。
 若监听函数内部依赖了reactive数据，当这些数据变更时会触发监听函数。
 */
/**
 * 绑定阶段：effect 函数会包装传入的 方法，
 * 将其变成一个 effect 对象，并在绑定阶段的最后执行一遍传入的 方法（初始化）。
 */

/**
 * 收集阶段：effect 传入的方法内部，有响应式对象参与了计算，
 * 将触发 get 操作，会执行 track 方法，track 方法的重点是
 * 将响应式对象改变的target 与 绑定阶段的 effect 对象一一对应起来。
 * 这两个阶段是同步执行的（activeReactiveEffectStack 协调），值会存在全局的 targetMap。
 */

/**
 * 触发阶段：当 响应式对象 set 时，
 * 会触发 trigger 方法，它会从 targetMap 中拿到
 * target 对应的 effects，并遍历执行。
 */
export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: true
  active: boolean
  raw: () => T
  deps: Array<Dep>
  options: ReactiveEffectOptions
}

export interface ReactiveEffectOptions {
  lazy?: boolean
  computed?: boolean
  scheduler?: (run: Function) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}

export type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type: OperationTypes
  key: any
} & DebuggerEventExtraInfo

export interface DebuggerEventExtraInfo {
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

export const effectStack: ReactiveEffect[] = []

export const ITERATE_KEY = Symbol('iterate')

export function isEffect(fn: any): fn is ReactiveEffect {
  return fn != null && fn._isEffect === true
}

//() => (dummy = counter.num)
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) {
    fn = fn.raw
  }
  //() => (dummy = counter.num)
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

export function stop(effect: ReactiveEffect) {
  if (effect.active) {
    cleanup(effect)
    if (effect.options.onStop) {
      effect.options.onStop()
    }
    effect.active = false
  }
}

//() => (dummy = counter.num)
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(...args: unknown[]): unknown {
    return run(effect, fn, args)
  } as ReactiveEffect

  effect._isEffect = true
  effect.active = true
  effect.raw = fn
  effect.deps = []//在执行对应监听函数时，收集函数内部的其他依赖
  effect.options = options

  return effect
}

function run(effect: ReactiveEffect, fn: Function, args: unknown[]): unknown {
  if (!effect.active) {
    return fn(...args)
  }
  //在监听函数中，又改变了依赖数据，按正常逻辑是会不断的触发监听函数的。
  //但通过effectStack.includes(effect)这么一个判断逻辑，自然而然就避免了递归循环。
  if (!effectStack.includes(effect)) {
    //effectStack中没有包含effect时，才走这一步
    cleanup(effect) //处理监听函数中可能有逻辑判断，导致有的数据不需要获取，所以可以避免每次更新

    /**
    执行effect-->把effect放入到栈中-->
    执行fn，触发get-->触发track-->
    触发effectStack[effectStack.length-1]，收集依赖-->
    添加dep（[effect]）到effect.deps-->执行完fn，effectStack出栈
    */
    try {
      //将本effect推到effect栈中

      /*[effect = function reactiveEffect(...args: unknown[]): unknown {
        return run(effect, fn, args)
      } ]*/
      effectStack.push(effect)
      return fn(...args)
      //执行原始函数并返回
    } finally {
      // console.log('effectStack出栈')
      effectStack.pop()
    }
  }
}
/**
 * 清除effect.deps的依赖，就可以更新targetMap{
   targetMap{
     key:{
       set([effect]);//这其中的依赖
     }
   }
 }，就可以避免不必要的重复更新
 * @param effect 
 */
function cleanup(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

let shouldTrack = true

export function pauseTracking() {
  shouldTrack = false
}

export function resumeTracking() {
  shouldTrack = true
}

//{a:1}  

export function track(target: object, type: OperationTypes, key?: unknown) {
  if (!shouldTrack || effectStack.length === 0) {
    return
  }
  const effect = effectStack[effectStack.length - 1]

  /**
    //render逻辑
    effect = function reactiveEffect(...args: unknown[]): unknown {
      return run(effect, fn, args)
      ==>fn-->render
    }
  */
  if (type === OperationTypes.ITERATE) {
    key = ITERATE_KEY
  }
  /**
   * targetMap 存储着原始数据到操作类型到具体操作的东西
   * target->depsMap{key->dep{->effect}}
   {
     a:1
   }
   * {
   *  target:{
   *    key(对象对应的某一个key)):Set([effect])
   *  }
   * }
   */
  let depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key!)
  if (dep === void 0) {
    depsMap.set(key!, (dep = new Set()))
  }
  if (!dep.has(effect)) {
    dep.add(effect)
    effect.deps.push(dep)
    if (__DEV__ && effect.options.onTrack) {
      effect.options.onTrack({
        effect,
        target,
        type,
        key
      })
    }
  }
}

export function trigger(
  target: object,
  type: OperationTypes,
  key?: unknown,
  extraInfo?: DebuggerEventExtraInfo
) {
  /**
   * targetMap 存储着原始数据到操作类型到具体操作的东西
   * target->depsMap{key->dep{->effect}}
   * {
   *  target:{
   *    key(get、set):Set([effect])
   *  }
   * }
   */
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    // never been tracked
    return
  }
  const effects = new Set<ReactiveEffect>()
  const computedRunners = new Set<ReactiveEffect>()
  if (type === OperationTypes.CLEAR) {
    // collection being cleared, trigger all effects for target
    depsMap.forEach(dep => {
      addRunners(effects, computedRunners, dep)
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      addRunners(effects, computedRunners, depsMap.get(key))
    }
    // also run for iteration key on ADD | DELETE
    if (type === OperationTypes.ADD || type === OperationTypes.DELETE) {
      //对于push操作，length已经会变得相同，不会触发两次trigger，所以新增需要特殊处理
      const iterationKey = Array.isArray(target) ? 'length' : ITERATE_KEY
      addRunners(effects, computedRunners, depsMap.get(iterationKey))
    }
  }
  const run = (effect: ReactiveEffect) => {
    scheduleRun(effect, target, type, key, extraInfo)
  }
  // Important: computed effects must be run first so that computed getters
  // can be invalidated before any normal effects that depend on them are run.
  computedRunners.forEach(run)
  //[effect]
  effects.forEach(run)
}

function addRunners(
  effects: Set<ReactiveEffect>,
  computedRunners: Set<ReactiveEffect>,
  effectsToAdd: Set<ReactiveEffect> | undefined
) {
  if (effectsToAdd !== void 0) {
    effectsToAdd.forEach(effect => {
      if (effect.options.computed) {
        computedRunners.add(effect)
      } else {
        effects.add(effect)
      }
    })
  }
}

function scheduleRun(
  effect: ReactiveEffect,
  target: object,
  type: OperationTypes,
  key: unknown,
  extraInfo?: DebuggerEventExtraInfo
) {
  if (__DEV__ && effect.options.onTrigger) {
    const event: DebuggerEvent = {
      effect,
      target,
      key,
      type
    }
    effect.options.onTrigger(extraInfo ? extend(event, extraInfo) : event)
  }
  if (effect.options.scheduler !== void 0) {
    effect.options.scheduler(effect)
  } else {
    effect()
  }
}
