```js
/*
已知对象A = {name: 'sfd', getName: function(){console.log(this.name)}},
现要求⽤不同⽅式对A进⾏改造实现A.name发⽣变化时⽴即执⾏A.getName
 */
//方法一:使用代理
const A = {
  name: 'sfd',
  getName: function() {
    console.log(this.name);
  },
};
let proxy = new Proxy(A, {
  set: function(target, property, value, proxy) {
    Reflect.set(...arguments);
    if (property === 'name') {
      target.getName();
    }
  },
});
proxy.name = 1;

//方法二：使用对象的getter和setter
const A2 = {
  value: 'sfd',
  get name() {
    return this.value;
  },
  set name(value) {
    this.value = value;
    this.getName();
  },
  getName: function() {
    console.log(this.name);
  },
};

A2.name = 1;

//方法三:使用Object.defineProperty()
const A3 = {
  value: 'sfd',
  getName: function() {
    console.log(this.name);
  },
};

Object.defineProperty(A3, 'name', {
  get: () => {
    return this.value;
  },
  set: value => {
    this.value = value;
    A3.getName();
  },
});
A3.name = 1;

```
