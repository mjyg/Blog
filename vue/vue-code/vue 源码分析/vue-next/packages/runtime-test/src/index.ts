import {
  createRenderer,
  VNode,
  RootRenderFunction,
  App
} from '@vue/runtime-core'
import { nodeOps, TestNode, TestElement } from './nodeOps'
import { patchProp } from './patchProp'
import { serializeInner } from './serialize'

const { render: baseRender, createApp: baseCreateApp } = createRenderer({
  patchProp,
  ...nodeOps
})

export const render = baseRender as RootRenderFunction<TestNode, TestElement>
export const createApp = baseCreateApp as () => App<TestElement>

// convenience for one-off render validations
export function renderToString(vnode: VNode) {
  const root = nodeOps.createElement('div')
  render(vnode, root)
  return serializeInner(root)
}

export * from './triggerEvent'
export * from './serialize'
export * from './nodeOps'
export * from './utils/mockWarn'
export * from '@vue/runtime-core'
