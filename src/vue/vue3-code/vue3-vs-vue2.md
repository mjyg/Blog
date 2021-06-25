# vue3和vue2对比

## 响应式系统
Observer会观察两种类型的数据，Object 与 Array 

对于Array类型的数据，由于 JavaScript 的限制， Vue 不能检测变化,会先重写操作数组
的原型方法,当数组发生变化时，触发 notify <br>
如果是 push，unshift，splice 这些添加新元素的操作，则会使用observer观察新添加的
数据 <br>
重写完原型方法后，遍历拿到数组中的每个数据 使用observer观察它 <br>

而对于Object类型的数据，则遍历它的每个key，使用 defineProperty 设置 getter 和 
setter，当触发getter的时候，observer则开始收集依赖，而触发setter的时候，observe
则触发notify<br>