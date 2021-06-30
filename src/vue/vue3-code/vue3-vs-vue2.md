# vue3和vue2对比

## 数据绑定

1.vue2通过正则匹配把template替换成with语句(因为with可以提升作用域链)，但是文档匹配次数越多执行越慢

  vue3通过AST(抽象语法树)直接创建vnode,通过词法分析可以直接找到变量

2.vue2实现双向数据绑定原理，是通过es5的 Object.defineProperty，根据具体的key去读取和修改。
其中的setter方法来实现数据劫持的，getter实现数据的修改。但是必须先知道想要拦截和修改的key是什么，
所以vue2对于新增的属性无能为力，比如无法监听属性的添加和删除、数组索引和长度的变更，
vue2的解决方法是使用Vue.set(object, propertyName, value) 等方法向嵌套对象添加响应式。

vue3.x使用了ES2015的更快的原生proxy 替代 Object.defineProperty。Proxy可以理解成，在对象之前架设
一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和
改写。Proxy可以直接监听对象而非属性，并返回一个新对象，具有更好的响应式支持

## Compiler优化

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
* 数字 3：代表xxxxx

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

有些Block结构是不稳定的，结构不稳定从结果上看指的是更新前后一个 block 的 dynamicChildren 中收集的
动态节点数量或顺序的不一致

例如下面的模板：
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
该Block结构就是不稳定的，