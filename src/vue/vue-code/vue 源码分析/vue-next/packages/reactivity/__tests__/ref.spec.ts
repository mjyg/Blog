import { ref, effect, reactive, isRef, toRefs } from '../src/index'
import { computed } from '@vue/runtime-dom'

describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    /**
     * 给effect传递一个函数，其内部做了一个赋值操作，
     * 把dummy改成了a.value赋值,这个函数默认会先执行一次，
     * 使得dummy变成1，当a.value发生变化时，effect会重新执行，dummy变成最新的值
     * [如果向effect传递一个方法,会立即执行一次，每当其内部依赖的ref数据发生变更时，会重新执行]
     */
    effect(() => {
      dummy = a.value
    })
    /**
     * 实现一个effect，
     * 需要维护一个effects的二维Map
     * target：{
     *  key:Set([effect])
     * }
     * 传递一个响应函数，然后会立即执行一次，并且把effect放到effectStack栈中存起来，
     * 如果里面有响应数据的访问，那么就会触发get操作，get中保存的有track，
     * track函数获取相应的effect，并绑定到这个数据的targetMap上，target-->key-->[effect]
     * 在修改对应的响应的值的时候，通过触发trigger，通过target-->key-->[effect]关系，获取到所有绑定的effect，
     * 重新执行一次，这个时候就能重新获取到修改之后的最新值，
     */
    expect(dummy).toBe(1)
    a.value = 2
    expect(dummy).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('should work like a normal property when nested in a reactive object', () => {
    const a = ref(1)
    const obj = reactive({
      a,
      b: {
        c: a,
        d: [a]
      }
    })
    let dummy1
    let dummy2
    let dummy3
    effect(() => {
      dummy1 = obj.a
      dummy2 = obj.b.c
      dummy3 = obj.b.d[0]
    })
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
    expect(dummy3).toBe(1)
    a.value++
    expect(dummy1).toBe(2)
    expect(dummy2).toBe(2)
    expect(dummy3).toBe(2)
    obj.a++
    expect(dummy1).toBe(3)
    expect(dummy2).toBe(3)
    expect(dummy3).toBe(3)
  })

  it('should unwrap nested ref in types', () => {
    const a = ref(0)
    const b = ref(a)

    expect(typeof (b.value + 1)).toBe('number')
  })

  it('should unwrap nested values in types', () => {
    const a = {
      b: ref(0)
    }

    const c = ref(a)

    expect(typeof (c.value.b + 1)).toBe('number')
  })

  it('should properly unwrap ref types nested inside arrays', () => {
    const arr = ref([1, ref(1)]).value
    // should unwrap to number[]
    arr[0]++
    arr[1]++

    const arr2 = ref([1, new Map<string, any>(), ref('1')]).value
    const value = arr2[0]
    if (typeof value === 'string') {
      value + 'foo'
    } else if (typeof value === 'number') {
      value + 1
    } else {
      // should narrow down to Map type
      // and not contain any Ref type
      value.has('foo')
    }
  })

  test('isRef', () => {
    expect(isRef(ref(1))).toBe(true)
    expect(isRef(computed(() => 1))).toBe(true)

    expect(isRef(0)).toBe(false)
    expect(isRef(1)).toBe(false)
    // an object that looks like a ref isn't necessarily a ref
    expect(isRef({ value: 0 })).toBe(false)
  })

  test('toRefs', () => {
    const a = reactive({
      x: 1,
      y: 2
    })

    //返回的是新的对象
    const { x, y } = toRefs(a)

    expect(isRef(x)).toBe(true)
    expect(isRef(y)).toBe(true)
    expect(x.value).toBe(1)
    expect(y.value).toBe(2)

    // source -> proxy
    a.x = 2 //设置代理对象之后的值
    a.y = 3
    expect(x.value).toBe(2) //在调用value的时候，调用get方法，触发proxy[x]
    expect(y.value).toBe(3)

    // proxy -> source
    x.value = 3 //修改x的value，触发set，修改proxy修改set
    y.value = 4
    expect(a.x).toBe(3)
    expect(a.y).toBe(4)

    // reactivity
    let dummyX, dummyY
    effect(() => {
      dummyX = x.value
      dummyY = y.value
    })
    expect(dummyX).toBe(x.value)
    expect(dummyY).toBe(y.value)

    // mutating source should trigger effect using the proxy refs
    a.x = 4
    a.y = 5
    expect(dummyX).toBe(4)
    expect(dummyY).toBe(5)
  })
})
