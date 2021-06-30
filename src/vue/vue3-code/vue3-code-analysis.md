# vue3浅析

**目录**
> * [vue2 vue3对比](#vue2-vue3对比)
> * [vue3 Compiler优化](#vue3-Compiler优化)
>   * [传统 Diff 算法](#传统-Diff-算法)
>   * [Block 配合 PatchFlags 做到靶向更新](#Block-配合-PatchFlags-做到靶向更新)
>   * [Block Tree](#Block-Tree)

## vue2 vue3对比

1. vue2通过正则匹配把template替换成with语句(因为with可以提升作用域链)，但是文档匹配次数越多执行越慢

  vue3通过AST(抽象语法树)直接创建vnode,通过词法分析可以直接找到变量

2.vue2实现双向数据绑定原理，是通过es5的 Object.defineProperty，根据具体的key去读取和修改。
其中的setter方法来实现数据劫持的，getter实现数据的修改。但是必须先知道想要拦截和修改的key是什么，
所以vue2对于新增的属性无能为力，比如无法监听属性的添加和删除、数组索引和长度的变更，
vue2的解决方法是使用Vue.set(object, propertyName, value) 等方法向嵌套对象添加响应式。

vue3.x使用了ES2015的更快的原生proxy 替代 Object.defineProperty。Proxy可以理解成，在对象之前架设
一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和
改写。Proxy可以直接监听对象而非属性，并返回一个新对象，具有更好的响应式支持

## vue3 Compiler优化

### 传统 Diff 算法
传统 vdom 的 Diff 算法总归要按照 vdom 树的层级结构一层一层的遍历<br>
如下模板所示：
```
<div>
    <p class="foo">bar</p>
</div>
```
它在 diff 这段 vnode(模板编译后的 vnode)时会经历：
* Div 标签的属性 + children
* <p> 标签的属性(class) + children
* 文本节点：bar

这是一段静态 vdom，它在组件更新阶段是不可能发生变化的。如果能在 diff 阶段跳过静态内容，那就会避免无用的 
vdom 树的遍历和比对，这是传统的优化思路----**跳过静态内容，只对比动态内容**。

### Block 配合 PatchFlags 做到靶向更新
Block Tree 和 PatchFlags 是 Vue3 充分利用编译信息并在 Diff 阶段所做的优化

现在包含静态和动态内容的模板如下：
```
<div>
    <p>foo</p>
    <p>{{ bar }}</p>
</div>
```
它对应的vdom树大概如下：
```js
const vnode = {
    tag: 'div',
    children: [
        { tag: 'p', children: 'foo' },
        { tag: 'p', children: ctx.bar },  // 这是动态节点
    ]
}
```
传统的 vdom 树中，我们在运行时得不到任何有用信息，但是 Vue3 的 compiler 能够分析模板并提取有用信息，
最终体现在 vdom 树上。例如它能够清楚的知道：哪些节点是动态节点，以及为什么它是动态的(是绑定了动态的 
class？还是绑定了动态的 style？亦或是其它动态的属性？)，总之编译器能够提取我们想要的信息，有了这些信
息我们就可以在创建 vnode 的过程中用PatchFlags为动态的节点打上标记

可以把 PatchFlags 简单的理解为一个数字标记，把这些数字赋予不同含义，例如：
* 数字 1：代表节点有动态的 textContent（例如上面模板中的 p 标签）
* 数字 2：代表元素有动态的 class 绑定
* 数字 3：代表xxx

之前的vdom树就可以修改成如下：
```js
const vnode = {
    tag: 'div',
    children: [
        { tag: 'p', children: 'foo' },
        { tag: 'p', children: ctx.bar, patchFlag: 1 /* 动态的 textContent */ },
    ]
}
```
带有patchFlag节点的就是动态节点，现在可以把动态节点提取出来放在dynamicChildren中：
```js
const vnode = {
    tag: 'div',
    children: [
        { tag: 'p', children: 'foo' },
        { tag: 'p', children: ctx.bar, patchFlag: 1 /* 动态的 textContent */ },
    ],
    dynamicChildren: [
        { tag: 'p', children: ctx.bar, patchFlag: 1 /* 动态的 textContent */ },
    ]
}
```
dynamicChildren 就是用来存储一个节点下所有子代动态节点的数组,例如：
```js
const vnode = {
    tag: 'div',
    children: [
        { tag: 'section', children: [
            { tag: 'p', children: ctx.bar, patchFlag: 1 /* 动态的 textContent */ },
        ]},
    ],
    dynamicChildren: [
        { tag: 'p', children: ctx.bar, patchFlag: 1 /* 动态的 textContent */ },
    ]
}
```
这个vnode就是一个Block,它不仅能收集直接动态子节点，还能收集所有子代节点中的动态节点，这样在 diff 
过程中就可以避免按照 vdom 树一层一层的遍历，而是直接找到 dynamicChildren 进行更新，而通过节点中的
patchFlag可以准确的知道需要为该节点应用哪些更新动作，这基本上就实现了靶向更新。

### Block Tree
在一棵 vdom 树中，会有多个 vnode 节点充当 Block 的角色，进而构成一棵 Block Tree。

dynamicChildren 的 diff 是忽略 vdom 树层级的,看如下模板：
```
<div>
  <section v-if="foo">
    <p>{{ a }}</p>
  </section>
  <section v-else>
       <div> <!-- 这个 div 标签在 diff 过程中被忽略 -->
            <p>{{ a }}</p>
        </div>
  </section >
</div>
```
当foo为真或为假时，block都为：
```js
const block = {
    tag: 'div',
    dynamicChildren: [
        { tag: 'p', children: ctx.a, patchFlag: 1 }
    ]
}
```
那么foo为假时的div标签就会被忽略，如果让使用了 v-if/v-else-if/v-else 等指令的元素也作为 Block，将
构成一棵 block tree：
```
Block(Div)
    - Block(Section v-if)
    - Block(Section v-else)
```
这个div标签的block就变成：
```js
const block = {
    tag: 'div',
    dynamicChildren: [
        { tag: 'section', { key: 0 }, dynamicChildren: [...]}, /* Block(Section v-if) */
        { tag: 'section', { key: 1 }, dynamicChildren: [...]}  /* Block(Section v-else) */
    ]
}
```
在 Diff 过程中，渲染器知道这是两个不同的 Block，就会做完全的替换

有些Block结构是不稳定的，结构不稳定从结果上看指的是更新前后一个 block 的 dynamicChildren 中收集的
动态节点数量或顺序的不一致

例如下面的模板：
```
<div>
    <p v-for="item in list">{{ item }}</p>
    <i>{{ foo }}</i>
    <i>{{ bar }}</i>
</div>
```
在 list 由 ​[1, 2]​ 变成 ​[1]​ 的前后，Fragment 这个 Block 看上去应该是：
```js
// 前
const prevBlock = {
    tag: 'div',
    dynamicChildren: [
        { tag: 'p', children: 1, 1 /* TEXT */ },
        { tag: 'p', children: 2, 1 /* TEXT */ },
        { tag: 'i', children: ctx.foo, 1 /* TEXT */ },
        { tag: 'i', children: ctx.bar, 1 /* TEXT */ },
    ]
}

// 后
const nextBlock = {
    tag: 'div',
    dynamicChildren: [
        { tag: 'p', children: item, 1 /* TEXT */ },
        { tag: 'i', children: ctx.foo, 1 /* TEXT */ },
        { tag: 'i', children: ctx.bar, 1 /* TEXT */ },
    ]
}
```
该Block结构就是不稳定的，prevBlcok 中有四个动态节点，nextBlock 中有三个动态节点。这时候要如何进行 
Diff？有的同学可能会说拿 dynamicChildren 进行传统 Diff，这是不对的，因为传统 Diff 的一个前置条件
是同层级节点间的 Diff，但是 dynamicChildren 内的节点未必是同层级的

实际上只需要让 v-for 的元素也作为一个 Block 就可以了。这样无论 v-for 
怎么变化，它始终都是一个 Block，这保证了结构稳定，无论 v-for 怎么变化，这颗 Block Tree 看上去都是：
```js
const block = {
    tag: 'div',
    dynamicChildren: [
        // 这是一个 Block 哦，它有 dynamicChildren
        { tag: Fragment, dynamicChildren: [/*.. v-for 的节点 ..*/] }
        { tag: 'i', children: ctx.foo, 1 /* TEXT */ },
        { tag: 'i', children: ctx.bar, 1 /* TEXT */ },
    ]
}
```
刚刚我们使用一个 Fragment 并让它充当 Block 的角色解决了 v-for 元素所在层级的结构稳定，但我们来看一
下这个 Fragment 本身：
```
{ tag: Fragment, dynamicChildren: [/*.. v-for 的节点 ..*/] }
```
对于如下这样的模板：
```
<p v-for="item in list">{{ item }}</p>
```
在 list 由 ​[1, 2]​ 变成 ​[1]​ 的前后，Fragment 这个 Block 看上去应该是：
```js
// 前
const prevBlock = {
    tag: Fragment,
    dynamicChildren: [
        { tag: 'p', children: item, 1 /* TEXT */ },
        { tag: 'p', children: item, 2 /* TEXT */ }
    ]
}

// 后
const prevBlock = {
    tag: Fragment,
    dynamicChildren: [
        { tag: 'p', children: item, 1 /* TEXT */ }
    ]
}
```
Fragment 这个 Block 仍然面临结构不稳定的情况，这种不一致会导致我们没有办法直接进行靶向 Diff，怎么办
呢？其实对于这种情况是没有办法的，我们只能抛弃 dynamicChildren 的 Diff，并回退到传统 Diff：即 
Diff Fragment 的 children 而非 dynamicChildren。

但需要注意的是 Fragment 的子节点(children)仍然可以是 Block：
```js
const block = {
    tag: Fragment,
    children: [
        { tag: 'p', children: item, dynamicChildren: [/*...*/], 1 /* TEXT */ },
        { tag: 'p', children: item, dynamicChildren: [/*...*/], 1 /* TEXT */ }
    ]
}
```
这样，对于 <p> 标签及其子代节点的 Diff 将恢复 Block Tree 的 Diff 模式。

什么样的 Fragment 是稳定的呢？例如v-for 的表达式是常量：
```
<p v-for="n in 10"></p>
<!-- 或者 -->
<p v-for="s in 'abc'"></p>
```
由于 ​10​ 和 ​'abc'​ 是常量，所有这两个 Fragment 是不会变化的，因此它是稳定的，对于稳定的 Fragment
 是不需要回退到传统 Diff 的，这在性能上会有一定的优势。
