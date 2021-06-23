import {
  ComponentInternalInstance,
  FunctionalComponent,
  Data
} from './component'
import {
  VNode,
  normalizeVNode,
  createVNode,
  Comment,
  cloneVNode
} from './vnode'
import { ShapeFlags } from './shapeFlags'
import { handleError, ErrorCodes } from './errorHandling'
import { PatchFlags, EMPTY_OBJ } from '@vue/shared'
import { warn } from './warning'

// mark the current rendering instance for asset resolution (e.g.
// resolveComponent, resolveDirective) during render
export let currentRenderingInstance: ComponentInternalInstance | null = null

// dev only flag to track whether $attrs was used during render.
// If $attrs was used during render then the warning for failed attrs
// fallthrough can be suppressed.
let accessedAttrs: boolean = false

export function markAttrsAccessed() {
  accessedAttrs = true
}

export function renderComponentRoot(
  instance: ComponentInternalInstance
): VNode {
  const {
    type: Component,
    vnode,
    renderProxy,
    props,
    slots,
    attrs,
    emit
  } = instance

  let result
  currentRenderingInstance = instance
  if (__DEV__) {
    accessedAttrs = false
  }
  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      result = normalizeVNode(instance.render!.call(renderProxy))
    } else {
      // functional
      const render = Component as FunctionalComponent
      result = normalizeVNode(
        render.length > 1
          ? render(props, {
              attrs,
              slots,
              emit
            })
          : render(props, null as any /* we know it doesn't need it */)
      )
    }

    // attr merging
    if (
      Component.props != null &&
      Component.inheritAttrs !== false &&
      attrs !== EMPTY_OBJ &&
      Object.keys(attrs).length
    ) {
      if (
        result.shapeFlag & ShapeFlags.ELEMENT ||
        result.shapeFlag & ShapeFlags.COMPONENT
      ) {
        result = cloneVNode(result, attrs)
      } else if (__DEV__ && !accessedAttrs) {
        warn(
          `Extraneous non-props attributes (${Object.keys(attrs).join(',')}) ` +
            `were passed to component but could not be automatically inhertied ` +
            `because component renders fragment or text root nodes.`
        )
      }
    }
  } catch (err) {
    handleError(err, instance, ErrorCodes.RENDER_FUNCTION)
    result = createVNode(Comment)
  }
  currentRenderingInstance = null
  return result
}

export function shouldUpdateComponent(
  prevVNode: VNode,
  nextVNode: VNode,
  optimized?: boolean
): boolean {
  const { props: prevProps, children: prevChildren } = prevVNode
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode
  if (patchFlag > 0) {
    if (patchFlag & PatchFlags.DYNAMIC_SLOTS) {
      // slot content that references values that might have changed,
      // e.g. in a v-for
      return true
    }
    if (patchFlag & PatchFlags.FULL_PROPS) {
      // presence of this flag indicates props are always non-null
      return hasPropsChanged(prevProps!, nextProps!)
    } else if (patchFlag & PatchFlags.PROPS) {
      const dynamicProps = nextVNode.dynamicProps!
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i]
        if (nextProps![key] !== prevProps![key]) {
          return true
        }
      }
    }
  } else if (!optimized) {
    // this path is only taken by manually written render functions
    // so presence of any children leads to a forced update
    if (prevChildren != null || nextChildren != null) {
      return true
    }
    if (prevProps === nextProps) {
      return false
    }
    if (prevProps === null) {
      return nextProps !== null
    }
    if (nextProps === null) {
      return true
    }
    return hasPropsChanged(prevProps, nextProps)
  }
  return false
}

function hasPropsChanged(prevProps: Data, nextProps: Data): boolean {
  const nextKeys = Object.keys(nextProps)
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }
  return false
}

export function updateHOCHostEl(
  { vnode, parent }: ComponentInternalInstance,
  el: object // HostNode
) {
  while (parent && parent.subTree === vnode) {
    ;(vnode = parent.vnode).el = el
    parent = parent.parent
  }
}
