# 手写lodash的_.get()
`_.get(object, path, [defaultValue])`
根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
参数：
* object (Object): 要检索的对象。
* path (Array|string): 要获取属性的路径。
* [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。<br>
例子：
```js
var object = { 'a': [{ 'b': { 'c': 3 } }] };
 
_.get(object, 'a[0].b.c');
// => 3
 
_.get(object, ['a', '0', 'b', 'c']);
// => 3
 
_.get(object, 'a.b.c', 'default');
// => 'default'
```
