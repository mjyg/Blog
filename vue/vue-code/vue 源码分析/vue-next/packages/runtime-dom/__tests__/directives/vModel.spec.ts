import {
  createApp,
  h,
  nextTick,
  createComponent,
  vModelDynamic,
  withDirectives,
  VNode
} from '@vue/runtime-dom'

const triggerEvent = (type: string, el: Element) => {
  const event = new Event(type)
  el.dispatchEvent(event)
}

const withVModel = (node: VNode, arg: any, mods?: any) =>
  withDirectives(node, [[vModelDynamic, arg, '', mods]])

const setValue = function(this: any, value: any) {
  this.value = value
}

let app: any, root: any

beforeEach(() => {
  app = createApp()
  root = document.createElement('div') as any
})

describe('vModel', () => {
  it('should work with text input', async () => {
    const component = createComponent({
      data() {
        return { value: null }
      },
      render() {
        return [
          withVModel(
            h('input', {
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const input = root.querySelector('input')
    const data = root._vnode.component.data

    input.value = 'foo'
    triggerEvent('input', input)
    await nextTick()
    expect(data.value).toEqual('foo')

    data.value = 'bar'
    await nextTick()
    expect(input.value).toEqual('bar')
  })

  it('should work with textarea', async () => {
    const component = createComponent({
      data() {
        return { value: null }
      },
      render() {
        return [
          withVModel(
            h('textarea', {
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const input = root.querySelector('textarea')
    const data = root._vnode.component.data

    input.value = 'foo'
    triggerEvent('input', input)
    await nextTick()
    expect(data.value).toEqual('foo')

    data.value = 'bar'
    await nextTick()
    expect(input.value).toEqual('bar')
  })

  it('should support modifiers', async () => {
    const component = createComponent({
      data() {
        return { number: null, trim: null, lazy: null }
      },
      render() {
        return [
          withVModel(
            h('input', {
              class: 'number',
              'onUpdate:modelValue': (val: any) => {
                this.number = val
              }
            }),
            this.number,
            {
              number: true
            }
          ),
          withVModel(
            h('input', {
              class: 'trim',
              'onUpdate:modelValue': (val: any) => {
                this.trim = val
              }
            }),
            this.trim,
            {
              trim: true
            }
          ),
          withVModel(
            h('input', {
              class: 'lazy',
              'onUpdate:modelValue': (val: any) => {
                this.lazy = val
              }
            }),
            this.lazy,
            {
              lazy: true
            }
          )
        ]
      }
    })
    app.mount(component, root)

    const number = root.querySelector('.number')
    const trim = root.querySelector('.trim')
    const lazy = root.querySelector('.lazy')
    const data = root._vnode.component.data

    number.value = '+01.2'
    triggerEvent('input', number)
    await nextTick()
    expect(data.number).toEqual(1.2)

    trim.value = '    hello, world    '
    triggerEvent('input', trim)
    await nextTick()
    expect(data.trim).toEqual('hello, world')

    lazy.value = 'foo'
    triggerEvent('change', lazy)
    await nextTick()
    expect(data.lazy).toEqual('foo')
  })

  it('should work with checkbox', async () => {
    const component = createComponent({
      data() {
        return { value: null }
      },
      render() {
        return [
          withVModel(
            h('input', {
              type: 'checkbox',
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const input = root.querySelector('input')
    const data = root._vnode.component.data

    input.checked = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toEqual(true)

    data.value = false
    await nextTick()
    expect(input.checked).toEqual(false)
  })

  it(`should support array as a checkbox model`, async () => {
    const component = createComponent({
      data() {
        return { value: [] }
      },
      render() {
        return [
          withVModel(
            h('input', {
              type: 'checkbox',
              class: 'foo',
              value: 'foo',
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          ),
          withVModel(
            h('input', {
              type: 'checkbox',
              class: 'bar',
              value: 'bar',
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const foo = root.querySelector('.foo')
    const bar = root.querySelector('.bar')
    const data = root._vnode.component.data

    foo.checked = true
    triggerEvent('change', foo)
    await nextTick()
    expect(data.value).toMatchObject(['foo'])

    bar.checked = true
    triggerEvent('change', bar)
    await nextTick()
    expect(data.value).toMatchObject(['foo', 'bar'])

    bar.checked = false
    triggerEvent('change', bar)
    await nextTick()
    expect(data.value).toMatchObject(['foo'])

    foo.checked = false
    triggerEvent('change', foo)
    await nextTick()
    expect(data.value).toMatchObject([])

    data.value = ['foo']
    await nextTick()
    expect(bar.checked).toEqual(false)
    expect(foo.checked).toEqual(true)

    data.value = ['bar']
    await nextTick()
    expect(foo.checked).toEqual(false)
    expect(bar.checked).toEqual(true)

    data.value = []
    await nextTick()
    expect(foo.checked).toEqual(false)
    expect(bar.checked).toEqual(false)
  })

  it('should work with radio', async () => {
    const component = createComponent({
      data() {
        return { value: null }
      },
      render() {
        return [
          withVModel(
            h('input', {
              type: 'radio',
              class: 'foo',
              value: 'foo',
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          ),
          withVModel(
            h('input', {
              type: 'radio',
              class: 'bar',
              value: 'bar',
              'onUpdate:modelValue': setValue.bind(this)
            }),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const foo = root.querySelector('.foo')
    const bar = root.querySelector('.bar')
    const data = root._vnode.component.data

    foo.checked = true
    triggerEvent('change', foo)
    await nextTick()
    expect(data.value).toEqual('foo')

    bar.checked = true
    triggerEvent('change', bar)
    await nextTick()
    expect(data.value).toEqual('bar')

    data.value = null
    await nextTick()
    expect(foo.checked).toEqual(false)
    expect(bar.checked).toEqual(false)

    data.value = 'foo'
    await nextTick()
    expect(foo.checked).toEqual(true)
    expect(bar.checked).toEqual(false)

    data.value = 'bar'
    await nextTick()
    expect(foo.checked).toEqual(false)
    expect(bar.checked).toEqual(true)
  })

  it('should work with single select', async () => {
    const component = createComponent({
      data() {
        return { value: null }
      },
      render() {
        return [
          withVModel(
            h(
              'select',
              {
                value: null,
                'onUpdate:modelValue': setValue.bind(this)
              },
              [h('option', { value: 'foo' }), h('option', { value: 'bar' })]
            ),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const input = root.querySelector('select')
    const foo = root.querySelector('option[value=foo]')
    const bar = root.querySelector('option[value=bar]')
    const data = root._vnode.component.data

    foo.selected = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toEqual('foo')

    foo.selected = false
    bar.selected = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toEqual('bar')

    foo.selected = false
    bar.selected = false
    data.value = 'foo'
    await nextTick()
    expect(input.value).toEqual('foo')
    expect(foo.selected).toEqual(true)
    expect(bar.selected).toEqual(false)

    foo.selected = true
    bar.selected = false
    data.value = 'bar'
    await nextTick()
    expect(input.value).toEqual('bar')
    expect(foo.selected).toEqual(false)
    expect(bar.selected).toEqual(true)
  })

  it('should work with multiple select', async () => {
    const component = createComponent({
      data() {
        return { value: [] }
      },
      render() {
        return [
          withVModel(
            h(
              'select',
              {
                value: null,
                multiple: true,
                'onUpdate:modelValue': setValue.bind(this)
              },
              [h('option', { value: 'foo' }), h('option', { value: 'bar' })]
            ),
            this.value
          )
        ]
      }
    })
    app.mount(component, root)

    const input = root.querySelector('select')
    const foo = root.querySelector('option[value=foo]')
    const bar = root.querySelector('option[value=bar]')
    const data = root._vnode.component.data

    foo.selected = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toMatchObject(['foo'])

    foo.selected = false
    bar.selected = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toMatchObject(['bar'])

    foo.selected = true
    bar.selected = true
    triggerEvent('change', input)
    await nextTick()
    expect(data.value).toMatchObject(['foo', 'bar'])

    foo.selected = false
    bar.selected = false
    data.value = ['foo']
    await nextTick()
    expect(input.value).toEqual('foo')
    expect(foo.selected).toEqual(true)
    expect(bar.selected).toEqual(false)

    foo.selected = false
    bar.selected = false
    data.value = ['foo', 'bar']
    await nextTick()
    expect(foo.selected).toEqual(true)
    expect(bar.selected).toEqual(true)
  })
})
