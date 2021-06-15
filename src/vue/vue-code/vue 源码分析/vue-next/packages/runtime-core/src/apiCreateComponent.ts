import {
  ComputedOptions,
  MethodOptions,
  ComponentOptionsWithoutProps,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps
} from './apiOptions'
import { SetupContext, RenderFunction } from './component'
import { ComponentPublicInstance } from './componentProxy'
import { ExtractPropTypes, ComponentPropsOptions } from './componentProps'
import { isFunction } from '@vue/shared'
import { VNodeProps } from './vnode'

// overload 1: direct setup function
// (uses user defined props interface)
export function createComponent<Props, RawBindings = object>(
  setup: (props: Props, ctx: SetupContext) => RawBindings | RenderFunction
): {
  new (): ComponentPublicInstance<
    Props,
    RawBindings,
    {},
    {},
    {},
    // public props
    VNodeProps & Props
  >
}

// overload 2: object format with no props
// (uses user defined props interface)
// return type is for Vetur and TSX support
export function createComponent<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithoutProps<Props, RawBindings, D, C, M>
): {
  new (): ComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    VNodeProps & Props
  >
}

// overload 3: object format with array props declaration
// props inferred as { [key in PropNames]?: any }
// return type is for Vetur and TSX support
export function createComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithArrayProps<PropNames, RawBindings, D, C, M>
): {
  // array props technically doesn't place any contraints on props in TSX
  new (): ComponentPublicInstance<VNodeProps, RawBindings, D, C, M>
}

// overload 4: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function createComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithObjectProps<PropsOptions, RawBindings, D, C, M>
): {
  // for Vetur and TSX support
  new (): ComponentPublicInstance<
    ExtractPropTypes<PropsOptions>,
    RawBindings,
    D,
    C,
    M,
    VNodeProps & ExtractPropTypes<PropsOptions, false>
  >
}

// implementation, close to no-op
export function createComponent(options: unknown) {
  return isFunction(options) ? { setup: options } : options
}
