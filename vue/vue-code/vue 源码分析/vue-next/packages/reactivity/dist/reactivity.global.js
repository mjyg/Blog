var VueObserver = (function (exports) {
  'use strict';

  // Make a map and return a function for checking if a key
  // is in that map.
  //
  // IMPORTANT: all calls of this function must be prefixed with /*#__PURE__*/
  // So that rollup can tree-shake them if necessary.
  function makeMap(str, expectsLowerCase) {
      const map = Object.create(null);
      const list = str.split(',');
      for (let i = 0; i < list.length; i++) {
          map[list[i]] = true;
      }
      return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
  }

  const EMPTY_OBJ =  Object.freeze({})
      ;
  const extend = (a, b) => {
      for (const key in b) {
          a[key] = b[key];
      }
      return a;
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isFunction = (val) => typeof val === 'function';
  const isSymbol = (val) => typeof val === 'symbol';
  const isObject = (val) => val !== null && typeof val === 'object';
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  function toRawType(value) {
      return toTypeString(value).slice(8, -1);
  }
  const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  };
  // compare whether a value has changed, accounting for NaN.
  const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

  // global immutability lock
  let LOCKED = true;
  function lock() {
      LOCKED = true;
  }
  function unlock() {
      LOCKED = false;
  }

  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
      .map(key => Symbol[key])
      .filter(isSymbol));
  /**
   * 创建proxy里面的get处理函数
   * @param isReadonly 否是是处理只读
   */
  function createGetter(isReadonly) {
      /**
       * get函数
       */
      return function get(target, key, receiver) {
          //获取到Reflect执行的结果
          const res = Reflect.get(target, key, receiver);
          //防止key为Symbol的内置对象，比如 Symbol.iterator
          if (isSymbol(key) && builtInSymbols.has(key)) {
              return res;
          }
          //如果是ref包装过的数据，直接调用Value触发get，获取值之后，再返回
          if (isRef(res)) {
              return res.value;
          }
          //TODO:看着像跟踪，依赖收集，后面再看
          track(target, "get" /* GET */, key);
          //{a:1}
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
              : res;
      };
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
  function set(target, key, value, receiver) {
      //获取原始的数据
      value = toRaw(value);
      //拿到之前的老值
      const oldValue = target[key];
      //判断老数据是否是已经被ref处理过的，并且新数据没有没ref处理过
      if (isRef(oldValue) && !isRef(value)) {
          //更新老数据，并且返回
          // 如果 value 不是响应式数据，则需要将其赋值给 oldValue，调用set value，
          //如果 isObject(value) ，则会经过 reactive 再包装一次，将其变成响应式数据
          oldValue.value = value;
          return true;
      }
      /**
       *   key是target自己的属性
       *
       *   这个方法是解决 数组push时，会调用两次 set 的情况，比如 arr.push(1)
       *   第一次set，在数组尾部添加1
       *   第二次set，给数组添加length属性
       *   hasOwnProperty 方法用来判断目标对象是否含有指定属性。数组本身就有length的属性，所以这里是 true
       */
      const hadKey = hasOwn(target, key);
      //执行返回结果
      const result = Reflect.set(target, key, value, receiver);
      // don't trigger if target is something up in the prototype chain of original
      //target 如果只读 或者 存在于 reactiveToRaw 则不进入条件，reactiveToRaw 储存着代理后的对象
      //已经是代理之后的值了
      if (target === toRaw(receiver)) {
          //如果是原始数据原型链上自己的操作，就不触发
          /* istanbul ignore else */
          {
              const extraInfo = { oldValue, newValue: value };
              if (!hadKey) {
                  trigger(target, "add" /* ADD */, key, extraInfo);
              }
              else if (hasChanged(value, oldValue)) {
                  trigger(target, "set" /* SET */, key, extraInfo);
              }
          }
      }
      return result;
  }
  //删除属性处理
  function deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
          /* istanbul ignore else */
          {
              trigger(target, "delete" /* DELETE */, key, { oldValue });
          }
      }
      return result;
  }
  //查询属性处理
  function has(target, key) {
      const result = Reflect.has(target, key);
      track(target, "has" /* HAS */, key);
      return result;
  }
  //获取key的属性处理
  function ownKeys(target) {
      track(target, "iterate" /* ITERATE */);
      return Reflect.ownKeys(target);
  }
  //可变数据处理handler
  const mutableHandlers = {
      get: createGetter(false),
      set,
      deleteProperty,
      has,
      ownKeys
  };
  //只读数据handler
  const readonlyHandlers = {
      //创建get
      get: createGetter(true),
      //创建set
      set(target, key, value, receiver) {
          //判断是否已经锁住
          if (LOCKED) {
              {
                  console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
              }
              return true;
          }
          else {
              return set(target, key, value, receiver);
          }
      },
      deleteProperty(target, key) {
          if (LOCKED) {
              {
                  console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
              }
              return true;
          }
          else {
              return deleteProperty(target, key);
          }
      },
      has,
      ownKeys
  };

  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get(target, key, wrap) {
      target = toRaw(target);
      key = toRaw(key);
      track(target, "get" /* GET */, key);
      return wrap(getProto(target).get.call(target, key));
  }
  function has$1(key) {
      const target = toRaw(this);
      key = toRaw(key);
      track(target, "has" /* HAS */, key);
      return getProto(target).has.call(target, key);
  }
  function size(target) {
      target = toRaw(target);
      track(target, "iterate" /* ITERATE */);
      return Reflect.get(getProto(target), 'size', target);
  }
  function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      const result = proto.add.call(target, value);
      if (!hadKey) {
          /* istanbul ignore else */
          {
              trigger(target, "add" /* ADD */, value, { newValue: value });
          }
      }
      return result;
  }
  function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, key);
      const oldValue = proto.get.call(target, key);
      const result = proto.set.call(target, key, value);
      /* istanbul ignore else */
      {
          const extraInfo = { oldValue, newValue: value };
          if (!hadKey) {
              trigger(target, "add" /* ADD */, key, extraInfo);
          }
          else if (hasChanged(value, oldValue)) {
              trigger(target, "set" /* SET */, key, extraInfo);
          }
      }
      return result;
  }
  function deleteEntry(key) {
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, key);
      const oldValue = proto.get ? proto.get.call(target, key) : undefined;
      // forward the operation before queueing reactions
      const result = proto.delete.call(target, key);
      if (hadKey) {
          /* istanbul ignore else */
          {
              trigger(target, "delete" /* DELETE */, key, { oldValue });
          }
      }
      return result;
  }
  function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const oldTarget =  target instanceof Map
              ? new Map(target)
              : new Set(target)
          ;
      // forward the operation before queueing reactions
      const result = getProto(target).clear.call(target);
      if (hadItems) {
          /* istanbul ignore else */
          {
              trigger(target, "clear" /* CLEAR */, void 0, { oldTarget });
          }
      }
      return result;
  }
  function createForEach(isReadonly) {
      return function forEach(callback, thisArg) {
          const observed = this;
          const target = toRaw(observed);
          const wrap = isReadonly ? toReadonly : toReactive;
          track(target, "iterate" /* ITERATE */);
          // important: create sure the callback is
          // 1. invoked with the reactive map as `this` and 3rd arg
          // 2. the value received should be a corresponding reactive/readonly.
          function wrappedCallback(value, key) {
              return callback.call(observed, wrap(value), wrap(key), observed);
          }
          return getProto(target).forEach.call(target, wrappedCallback, thisArg);
      };
  }
  function createIterableMethod(method, isReadonly) {
      return function (...args) {
          const target = toRaw(this);
          const isPair = method === 'entries' ||
              (method === Symbol.iterator && target instanceof Map);
          const innerIterator = getProto(target)[method].apply(target, args);
          const wrap = isReadonly ? toReadonly : toReactive;
          track(target, "iterate" /* ITERATE */);
          // return a wrapped iterator which returns observed versions of the
          // values emitted from the real iterator
          return {
              // iterator protocol
              next() {
                  const { value, done } = innerIterator.next();
                  return done
                      ? { value, done }
                      : {
                          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                          done
                      };
              },
              // iterable protocol
              [Symbol.iterator]() {
                  return this;
              }
          };
      };
  }
  function createReadonlyMethod(method, type) {
      return function (...args) {
          if (LOCKED) {
              {
                  const key = args[0] ? `on key "${args[0]}" ` : ``;
                  console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
              }
              return type === "delete" /* DELETE */ ? false : this;
          }
          else {
              return method.apply(this, args);
          }
      };
  }
  const mutableInstrumentations = {
      get(key) {
          return get(this, key, toReactive);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false)
  };
  const readonlyInstrumentations = {
      get(key) {
          return get(this, key, toReadonly);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add: createReadonlyMethod(add, "add" /* ADD */),
      set: createReadonlyMethod(set$1, "set" /* SET */),
      delete: createReadonlyMethod(deleteEntry, "delete" /* DELETE */),
      clear: createReadonlyMethod(clear, "clear" /* CLEAR */),
      forEach: createForEach(true)
  };
  const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(method => {
      mutableInstrumentations[method] = createIterableMethod(method, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true);
  });
  function createInstrumentationGetter(instrumentations) {
      return (target, key, receiver) => Reflect.get(hasOwn(instrumentations, key) && key in target
          ? instrumentations
          : target, key, receiver);
  }
  const mutableCollectionHandlers = {
      get: createInstrumentationGetter(mutableInstrumentations)
  };
  const readonlyCollectionHandlers = {
      get: createInstrumentationGetter(readonlyInstrumentations)
  };

  const targetMap = new WeakMap();
  // WeakMaps that store {raw <-> observed} pairs.
  //原始数据到响应数据之间的映射
  const rawToReactive = new WeakMap();
  const reactiveToRaw = new WeakMap();
  const rawToReadonly = new WeakMap();
  const readonlyToRaw = new WeakMap();
  // WeakSets for values that are marked readonly or non-reactive during
  // observable creation.
  const readonlyValues = new WeakSet();
  const nonReactiveValues = new WeakSet();
  const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
  const isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
  /**
   * 判断是否可以observable
   * @param value
   */
  const canObserve = (value) => {
      return (
      //不是Vue对象
      !value._isVue &&
          //不是VNode
          !value._isVNode &&
          //是Object、Array、Map、Set、WeakMap、WeakSet
          isObservableType(toRawType(value)) &&
          //没有被代理过
          !nonReactiveValues.has(value));
  };
  function reactive(target) {
      // if trying to observe a readonly proxy, return the readonly version.
      //如果target是只读，返回这个target
      if (readonlyToRaw.has(target)) {
          return target;
      }
      // target is explicitly marked as readonly by user
      //target被用户标记成了只读，那么就让他变成只读，并返回
      if (readonlyValues.has(target)) {
          return readonly(target);
      }
      /*
        { {a:1}:Proxy }
      */
      //创建响应式数据
      return createReactiveObject(target, //原始值
      rawToReactive, //原始值到响应数据的映射  { {a:1}:Proxy }
      reactiveToRaw, //响应数据到原始值的映射 { Proxy:{a:1} }
      mutableHandlers, mutableCollectionHandlers);
  }
  function readonly(target) {
      // value is a mutable observable, retrieve its original and return
      // a readonly version.
      //如果值已经是响应类型的值了，那么就取出他的原始值
      if (reactiveToRaw.has(target)) {
          target = reactiveToRaw.get(target);
      }
      //创建响应对象
      return createReactiveObject(target, //原始值
      rawToReadonly, //原始值到只读数据的映射
      readonlyToRaw, //只读数据到原始值的映射
      readonlyHandlers, readonlyCollectionHandlers);
  }
  /**
   * 创建响应类型
   * @param target
   * @param toProxy
   * @param toRaw
   * @param baseHandlers
   * @param collectionHandlers
   */
  function createReactiveObject(target, toProxy, toRaw, baseHandlers, collectionHandlers) {
      //判断是否是基本元素（数字、字符串、布尔），如果是基本元素，就直接返回
      if (!isObject(target)) {
          {
              console.warn(`value cannot be made reactive: ${String(target)}`);
          }
          return target;
      }
      // target already has corresponding Proxy
      //获取已经处理过的对象（可相应的、只读的）
      let observed = toProxy.get(target); ///原始值到响应数据的映射  { {a:1}:Proxy }
      //如果已经有了处理过的对象（可相应的、只读的），直接返回此对象
      if (observed !== void 0) {
          return observed;
      }
      // target is already a Proxy
      //数据已经是一个处理过的对象（可相应的、只读的），返回
      if (toRaw.has(target)) {
          //响应数据到原始值的映射 { Proxy:{a:1} }
          return target;
      }
      // only a whitelist of value types can be observed.
      //只有白名单的对象才可以被代理
      if (!canObserve(target)) {
          return target;
      }
      //collectionTypes表示Set, Map, WeakMap, WeakSet的集合，判断对象是否是这几种类型，来使用不同的处理函数
      const handlers = collectionTypes.has(target.constructor)
          ? collectionHandlers
          : baseHandlers;
      //数据处理
      observed = new Proxy(target, handlers);
      toProxy.set(target, observed); //设置原始数据到处理后的数据的弱引用
      toRaw.set(observed, target); //设置处理后的数据到原始数据的弱引用
      //如果之前数据没有处理过，那么就设置target到key到Dep的引用关系
      if (!targetMap.has(target)) {
          targetMap.set(target, new Map());
      }
      return observed;
  }
  function isReactive(value) {
      return reactiveToRaw.has(value) || readonlyToRaw.has(value);
  }
  function isReadonly(value) {
      return readonlyToRaw.has(value);
  }
  /**
   * 获取原始数据
   * @param observed
   */
  function toRaw(observed) {
      return reactiveToRaw.get(observed) || readonlyToRaw.get(observed) || observed;
  }
  /**
   * 标记数据为只读数据
   * @param value
   */
  function markReadonly(value) {
      readonlyValues.add(value);
      return value;
  }
  //标记没有被处理过的数据
  function markNonReactive(value) {
      nonReactiveValues.add(value);
      return value;
  }

  const effectStack = [];
  const ITERATE_KEY = Symbol('iterate');
  function isEffect(fn) {
      return fn != null && fn._isEffect === true;
  }
  //() => (dummy = counter.num)
  function effect(fn, options = EMPTY_OBJ) {
      if (isEffect(fn)) {
          fn = fn.raw;
      }
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          //
          //默认{}
          effect();
      }
      return effect;
  }
  function stop(effect) {
      if (effect.active) {
          cleanup(effect);
          if (effect.options.onStop) {
              effect.options.onStop();
          }
          effect.active = false;
      }
  }
  //() => (dummy = counter.num)
  function createReactiveEffect(fn, options) {
      const effect = function reactiveEffect(...args) {
          return run(effect, fn, args);
      };
      effect._isEffect = true;
      effect.active = true;
      effect.raw = fn;
      effect.deps = [];
      effect.options = options;
      return effect;
  }
  function run(effect, fn, args) {
      if (!effect.active) {
          return fn(...args);
      }
      //在监听函数中，又改变了依赖数据，按正常逻辑是会不断的触发监听函数的。
      //但通过effectStack.includes(effect)这么一个判断逻辑，自然而然就避免了递归循环。
      if (!effectStack.includes(effect)) {
          //effectStack中没有包含effect时，才走这一步
          cleanup(effect); //处理监听函数中可能有逻辑判断，导致有的数据不需要获取，如果所以可以避免每次更新
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
              effectStack.push(effect);
              return fn(...args);
              //执行原始函数并返回
          }
          finally {
              // console.log('effectStack出栈')
              effectStack.pop();
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
  function cleanup(effect) {
      const { deps } = effect;
      if (deps.length) {
          for (let i = 0; i < deps.length; i++) {
              deps[i].delete(effect);
          }
          deps.length = 0;
      }
  }
  let shouldTrack = true;
  function pauseTracking() {
      shouldTrack = false;
  }
  function resumeTracking() {
      shouldTrack = true;
  }
  //{a:1}
  function track(target, type, key) {
      if (!shouldTrack || effectStack.length === 0) {
          return;
      }
      const effect = effectStack[effectStack.length - 1];
      if (type === "iterate" /* ITERATE */) {
          key = ITERATE_KEY;
      }
      /**
       * targetMap 存储着原始数据到操作类型到具体操作的东西
       * target->depsMap{key->dep{->effect}}
       * {
       *  target:{
       *    key(对象对应的某一个key)):Set([effect])
       *  }
       * }
       */
      let depsMap = targetMap.get(target);
      if (depsMap === void 0) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (dep === void 0) {
          depsMap.set(key, (dep = new Set()));
      }
      if (!dep.has(effect)) {
          dep.add(effect);
          effect.deps.push(dep);
          if ( effect.options.onTrack) {
              effect.options.onTrack({
                  effect,
                  target,
                  type,
                  key
              });
          }
      }
  }
  function trigger(target, type, key, extraInfo) {
      /**
       * targetMap 存储着原始数据到操作类型到具体操作的东西
       * target->depsMap{key->dep{->effect}}
       * {
       *  target:{
       *    key(get、set):Set([effect])
       *  }
       * }
       */
      const depsMap = targetMap.get(target);
      if (depsMap === void 0) {
          // never been tracked
          return;
      }
      const effects = new Set();
      const computedRunners = new Set();
      if (type === "clear" /* CLEAR */) {
          // collection being cleared, trigger all effects for target
          depsMap.forEach(dep => {
              addRunners(effects, computedRunners, dep);
          });
      }
      else {
          // schedule runs for SET | ADD | DELETE
          if (key !== void 0) {
              addRunners(effects, computedRunners, depsMap.get(key));
          }
          // also run for iteration key on ADD | DELETE
          if (type === "add" /* ADD */ || type === "delete" /* DELETE */) {
              //对于push操作，length已经会变得相同，不会触发两次trigger，所以新增需要特殊处理
              const iterationKey = Array.isArray(target) ? 'length' : ITERATE_KEY;
              addRunners(effects, computedRunners, depsMap.get(iterationKey));
          }
      }
      const run = (effect) => {
          scheduleRun(effect, target, type, key, extraInfo);
      };
      // Important: computed effects must be run first so that computed getters
      // can be invalidated before any normal effects that depend on them are run.
      computedRunners.forEach(run);
      effects.forEach(run);
  }
  function addRunners(effects, computedRunners, effectsToAdd) {
      if (effectsToAdd !== void 0) {
          effectsToAdd.forEach(effect => {
              if (effect.options.computed) {
                  computedRunners.add(effect);
              }
              else {
                  effects.add(effect);
              }
          });
      }
  }
  function scheduleRun(effect, target, type, key, extraInfo) {
      if ( effect.options.onTrigger) {
          const event = {
              effect,
              target,
              key,
              type
          };
          effect.options.onTrigger(extraInfo ? extend(event, extraInfo) : event);
      }
      if (effect.options.scheduler !== void 0) {
          effect.options.scheduler(effect);
      }
      else {
          effect();
      }
  }

  const convert = (val) => isObject(val) ? reactive(val) : val;
  function ref(raw) {
      if (isRef(raw)) {
          return raw;
      }
      /**
       * 如果是对象，则用 reactive 方法 包装 raw,不是就返回原始值
       * const convert = (val: any): any => (isObject(val) ? reactive(val) : val)
       */
      raw = convert(raw);
      /**
       * 返回v，Ref类型，获取value值的时候，调用track方法，存value值时，调用 trigger方法
       * v.value触发get，v.value=2触发set
       */
      const r = {
          _isRef: true,
          get value() {
              //TODO:why track
              track(r, "get" /* GET */, '');
              return raw;
          },
          set value(newVal) {
              //对数据包装
              raw = convert(newVal);
              //TODO:why trigger
              trigger(r, "set" /* SET */, '');
          }
      };
      return r;
  }
  //判断是否是ref
  function isRef(r) {
      return r ? r._isRef === true : false;
  }
  /**
   * 把代理对象转换为ref
   * @param object
   */
  function toRefs(object) {
      const ret = {};
      for (const key in object) {
          ret[key] = toProxyRef(object, key);
      }
      return ret;
  }
  /**
   * 转换ref数据
   * @param object
   * @param key
   */
  function toProxyRef(object, key) {
      return {
          _isRef: true,
          get value() {
              return object[key];
          },
          set value(newVal) {
              object[key] = newVal;
          }
      };
  }

  function computed(getterOrOptions) {
      let getter;
      let setter;
      //传入函数
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter =  () => {
                  console.warn('Write operation failed: computed value is readonly');
              }
              ;
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      let dirty = true;
      let value;
      //effect 方法不会立即执行，在 get 时执行
      const runner = effect(getter, {
          lazy: true,
          // mark effect as computed so that it gets priority during trigger
          computed: true,
          scheduler: () => {
              //在触发set时，触发trigger-->触发scheduler
              dirty = true;
          }
      });
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
                  value = runner();
                  dirty = false;
              }
              // When computed effects are accessed in a parent effect, the parent
              // should track all the dependencies the computed property has tracked.
              // This should also apply for chained computed properties.
              trackChildRun(runner);
              return value;
          },
          set value(newValue) {
              setter(newValue);
          }
      };
  }
  function trackChildRun(childRunner) {
      if (effectStack.length === 0) {
          return;
      }
      const parentRunner = effectStack[effectStack.length - 1];
      for (let i = 0; i < childRunner.deps.length; i++) {
          const dep = childRunner.deps[i];
          if (!dep.has(parentRunner)) {
              dep.add(parentRunner);
              parentRunner.deps.push(dep);
          }
      }
  }

  exports.ITERATE_KEY = ITERATE_KEY;
  exports.computed = computed;
  exports.effect = effect;
  exports.isReactive = isReactive;
  exports.isReadonly = isReadonly;
  exports.isRef = isRef;
  exports.lock = lock;
  exports.markNonReactive = markNonReactive;
  exports.markReadonly = markReadonly;
  exports.pauseTracking = pauseTracking;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.ref = ref;
  exports.resumeTracking = resumeTracking;
  exports.stop = stop;
  exports.toRaw = toRaw;
  exports.toRefs = toRefs;
  exports.unlock = unlock;

  return exports;

}({}));
//# sourceMappingURL=reactivity.global.js.map
