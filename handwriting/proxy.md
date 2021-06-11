# 手写proxy的get和set

proxy用法：
```js
var person = {name:''};
var personCopy = new Proxy(person,{
  get(target,key,receiver){
    console.log('get方法被拦截。。。');
    return Reflect.get(target,key,receiver);
  },
  set(target,key,value,receiver){
    console.log('set方法被拦截。。。')
    return Reflect.set(target,key,value,receiver);
  }
})
person.name = 'arvin';  // 未有拦截日志打出
personCopy.name = 'arvin';  // set方法被拦截。。。
console.log(person.name);   // 未有拦截日志打出
console.log(personCopy.name);   // get方法被拦截。。。
```
思路：被代理对象person的get和set不会经过代理拦截器get，set，而只有代理对象personCopy在get和set方法调用
的时候才会经过拦截器，由此可见ES6的代理Proxy是将personCopy对person进行了深拷贝，他们并不是在同一个内存
空间,对personCopy进行读取时对person做了相应的处理，看起来就像person和personCopy像指向同一个内存一样
代码如下:
```js
function MyProxy(target, handler) {
  const targetCopy = clone(target);
  for(const key of Object.keys(targetCopy)) {
    Object.defineProperty(targetCopy,key, {
      get(){
        handler.get && handler.get(target, key)
        return target[key]  //返回target的属性
      },
      set(value) {
        handler.set && handler.set(target, key,value)
        target[key] = value  //设置target的属性
      }
    })
  }
  return targetCopy
}

// 深拷贝
function clone(target){
  if(typeof target !== 'object' && target !== null) return

  const targetCopy = {}
  for(const key of Object.keys(target)) {
    targetCopy[key] = typeof target[key] !== 'object' && target[key] !== null ? target[key] : clone(target[key])
  }
  return targetCopy
}

console.log(person === personCopy)  // false
const person2 = person 
console.log(person === person2)   //true
```