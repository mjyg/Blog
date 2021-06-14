import {
  createStructuralDirectiveTransform,
  traverseChildren,
  TransformContext
} from '../transform'
import {
  NodeTypes,
  ElementTypes,
  ElementNode,
  DirectiveNode,
  IfBranchNode,
  SimpleExpressionNode,
  createSequenceExpression,
  createCallExpression,
  createConditionalExpression,
  ConditionalExpression,
  CallExpression,
  createSimpleExpression,
  createObjectProperty,
  createObjectExpression,
  IfCodegenNode,
  IfConditionalExpression,
  BlockCodegenNode,
  SlotOutletCodegenNode,
  ElementCodegenNode,
  ComponentCodegenNode
} from '../ast'
import { createCompilerError, ErrorCodes } from '../errors'
import { processExpression } from './transformExpression'
import {
  OPEN_BLOCK,
  CREATE_BLOCK,
  FRAGMENT,
  WITH_DIRECTIVES,
  CREATE_VNODE,
  CREATE_COMMENT
} from '../runtimeHelpers'
import { injectProp } from '../utils'

export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
    if (
      dir.name !== 'else' &&
      (!dir.exp || !(dir.exp as SimpleExpressionNode).content.trim())
    ) {
      const loc = dir.exp ? dir.exp.loc : node.loc
      context.onError(
        createCompilerError(ErrorCodes.X_V_IF_NO_EXPRESSION, dir.loc)
      )
      dir.exp = createSimpleExpression(`true`, false, loc)
    }

    if (!__BROWSER__ && context.prefixIdentifiers && dir.exp) {
      // dir.exp can only be simple expression because vIf transform is applied
      // before expression transform.
      dir.exp = processExpression(dir.exp as SimpleExpressionNode, context)
    }

    if (dir.name === 'if') {
      const branch = createIfBranch(node, dir)
      const codegenNode = createSequenceExpression([
        createCallExpression(context.helper(OPEN_BLOCK))
      ]) as IfCodegenNode

      context.replaceNode({
        type: NodeTypes.IF,
        loc: node.loc,
        branches: [branch],
        codegenNode
      })

      // Exit callback. Complete the codegenNode when all children have been
      // transformed.
      return () => {
        codegenNode.expressions.push(createCodegenNodeForBranch(
          branch,
          0,
          context
        ) as IfConditionalExpression)
      }
    } else {
      // locate the adjacent v-if
      const siblings = context.parent!.children
      const comments = []
      let i = siblings.indexOf(node)
      while (i-- >= -1) {
        const sibling = siblings[i]
        if (__DEV__ && sibling && sibling.type === NodeTypes.COMMENT) {
          context.removeNode(sibling)
          comments.unshift(sibling)
          continue
        }
        if (sibling && sibling.type === NodeTypes.IF) {
          // move the node to the if node's branches
          context.removeNode()
          const branch = createIfBranch(node, dir)
          if (__DEV__ && comments.length) {
            branch.children = [...comments, ...branch.children]
          }
          sibling.branches.push(branch)
          // since the branch was removed, it will not be traversed.
          // make sure to traverse here.
          traverseChildren(branch, context)
          // make sure to reset currentNode after traversal to indicate this
          // node has been removed.
          context.currentNode = null
          // attach this branch's codegen node to the v-if root.
          let parentCondition = sibling.codegenNode
            .expressions[1] as ConditionalExpression
          while (true) {
            if (
              parentCondition.alternate.type ===
              NodeTypes.JS_CONDITIONAL_EXPRESSION
            ) {
              parentCondition = parentCondition.alternate
            } else {
              parentCondition.alternate = createCodegenNodeForBranch(
                branch,
                sibling.branches.length - 1,
                context
              )
              break
            }
          }
        } else {
          context.onError(
            createCompilerError(ErrorCodes.X_V_ELSE_NO_ADJACENT_IF, node.loc)
          )
        }
        break
      }
    }
  }
)

function createIfBranch(node: ElementNode, dir: DirectiveNode): IfBranchNode {
  return {
    type: NodeTypes.IF_BRANCH,
    loc: node.loc,
    condition: dir.name === 'else' ? undefined : dir.exp,
    children: node.tagType === ElementTypes.TEMPLATE ? node.children : [node]
  }
}

function createCodegenNodeForBranch(
  branch: IfBranchNode,
  index: number,
  context: TransformContext
): IfConditionalExpression | BlockCodegenNode {
  if (branch.condition) {
    return createConditionalExpression(
      branch.condition,
      createChildrenCodegenNode(branch, index, context),
      // make sure to pass in asBlock: true so that the comment node call
      // closes the current block.
      createCallExpression(context.helper(CREATE_COMMENT), [
        __DEV__ ? '"v-if"' : '""',
        'true'
      ])
    ) as IfConditionalExpression
  } else {
    return createChildrenCodegenNode(branch, index, context) as BlockCodegenNode
  }
}

function createChildrenCodegenNode(
  branch: IfBranchNode,
  index: number,
  context: TransformContext
): CallExpression {
  const { helper } = context
  const keyProperty = createObjectProperty(
    `key`,
    createSimpleExpression(index + '', false)
  )
  const { children } = branch
  const child = children[0]
  const needFragmentWrapper =
    children.length !== 1 || child.type !== NodeTypes.ELEMENT
  if (needFragmentWrapper) {
    const blockArgs: CallExpression['arguments'] = [
      helper(FRAGMENT),
      createObjectExpression([keyProperty]),
      children
    ]
    if (children.length === 1 && child.type === NodeTypes.FOR) {
      // optimize away nested fragments when child is a ForNode
      const forBlockArgs = child.codegenNode.expressions[1].arguments
      // directly use the for block's children and patchFlag
      blockArgs[2] = forBlockArgs[2]
      blockArgs[3] = forBlockArgs[3]
    }
    return createCallExpression(helper(CREATE_BLOCK), blockArgs)
  } else {
    const childCodegen = (child as ElementNode).codegenNode as
      | ElementCodegenNode
      | ComponentCodegenNode
      | SlotOutletCodegenNode
    let vnodeCall = childCodegen
    // Element with custom directives. Locate the actual createVNode() call.
    if (vnodeCall.callee === WITH_DIRECTIVES) {
      vnodeCall = vnodeCall.arguments[0]
    }
    // Change createVNode to createBlock.
    if (vnodeCall.callee === CREATE_VNODE) {
      vnodeCall.callee = helper(CREATE_BLOCK)
    }
    // inject branch key
    injectProp(vnodeCall, keyProperty, context)
    return childCodegen
  }
}
