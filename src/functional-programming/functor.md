# 各种函子&Monad
## 函子(Functor)
* 函数式编程一般约定，函子有一个of方法，用来生成新的容器
* 函子的标志是容器具有map方法，该方法将容器里的每一个值，映射到另一个容器
~~~js
var Functor = function (x) {
    this.value = x;
};
Functor.of = (x) => new Functor(x);
Functor.prototype.map = function (f) { //如果这里使用箭头函数，则会丢失this,this指向window
    console.log(this);
    return Functor.of(f(this.value));
};
console.log(Functor.of(3).map((x) => x + 1));
~~~
打印结果:

![](https://user-gold-cdn.xitu.io/2020/6/13/172ae3bf1f2c022e?w=255&h=170&f=png&s=6093)<br>
ES6写法：
~~~js
class Functor {
    constructor(x) {
        this.value = x;
}
    map(f) {
      return new Functor(f(this.value));
    }
}
console.log(new Functor(3).map((x) => (x + 1)));
~~~
上面代码中，Functor是一个函子，它的map方法接收函数f作为参数，然后返回一个新的函子，里面包含的值是被f处理过的（f(this.value)）<br>
上面的例子说明，函数式编程里面的运算，都是通过函子完成，即运算不直接针对值，而是针对这个值的容器--函子，函子本身具有对外接口map方法，各种函数就是运算符，通过接口接入容器，引发容器里值的变形<br>
由于可以把运算方法封装在函子里，所以衍生出各种不同类型的函子，有多少种运算，就有多少种函子，函数式编程就变成了运用不同的函子解决实际问题

## Pointed函子
函子有一个of方法，用来生成新的容器，如Array是一个Pointed函子
~~~js
 console.log(Array.of('2',3,'1'))  // ["2", 3, "1"]
~~~

## Maybe函子
Maybe函子用来处理错误和异常<br>
用普通的函子当传入空值是可能会出错，如：
~~~js
Functor.of(null).map(s=>s.toUpperCase())
~~~
打印结果：

![](https://user-gold-cdn.xitu.io/2020/6/13/172ae67fc61d094c?w=529&h=70&f=png&s=8717)<br>
使用Maybe函子处理空值：
~~~js
 class Maybe extends Functor {
    map(f) {
      return this.value ? new Maybe(f(this.value)) : new Maybe(null);
    }
  }
  console.log(new Maybe(null).map((s) => s.toUpperCase()));
~~~
打印结果：

![](https://user-gold-cdn.xitu.io/2020/6/14/172ae6cbe7fb4f95?w=220&h=86&f=png&s=3118)
## Either函子
* 条件运算if..else是最常见的运算之一，函数式编程里，使用Either函子表达
* Either函子内部有两个值，左值和右值，右值是正常情况下使用的，左值是右值不存在时使用的默认值
~~~js
class Either extends Functor {
    constructor(left, right) {
      super();
      this.left = left;
      this.right = right;
    }
    map(f) {
      return this.right
        ? Either.of(this.left, f(this.right))
        : Either.of(f(this.left), this.right);
    }
    // of(left,right) { //这样写，of方法在实例的原型上
    //   return new Either(left,right)
    // }
  }
  Either.of = function (left, right) {
    //这样写，of方法在实例的构造方法上，和Functor一致
    return new Either(left, right);
  };
  var addOne = (x) => x + 1;
  console.log(Either.of(5, 6).map(addOne));
  console.log(Either.of(5, null).map(addOne));
~~~
打印结果：

![](https://user-gold-cdn.xitu.io/2020/6/14/172ae80a33ead1df?w=539&h=392&f=png&s=24842)

## Ap函子
* 函子里面包含的值是函数，即构造函数里this.value是一个函数
~~~js
class Ap extends Functor {
    ap(F) {
      console.log("F:", F);
      console.log("this.:", this.value);
      return new Ap(this.value(F.value));
    }
}
console.log(new Ap((x) => x + 1).ap(new Functor(3)));
~~~
打印结果：

![](https://user-gold-cdn.xitu.io/2020/6/13/172ae5a7ff452118?w=221&h=150&f=png&s=5771)
## Monad
如何处理嵌套的函子，如下例：
~~~js
Monad.of(Monad.of(Monad.of({ name: "Alice", number: 12 })))
~~~
* Monad是一种设计模式，表示讲一个运算过程，通过函数拆解成互相连接的多个步骤只要提供下一运算所需要的的函数，整个运算就会自动进行下去
* Promise就是一种Monad,Monad让我们避开了嵌套低于，可以轻松的进行深度嵌套的函数式编程
* Monad函子的作用是，总是返回一个单层的函子。它有一个flatMap方法，如果生成了嵌套的函子，它会取出后者内部的值，保证返回的永远是一个单层的容器
~~~js
class Functor {
  constructor(val) {
    this.value = val;
  }
  map(f) {
    return new Functor(f(this.value));
  }
}

class Monad extends Functor {
  join() {
    return this.value;
  }
  flatMap(f) {
    return this.map(f).join();
  }
}

class IO extends Monad {
  static of(value) {
    //类本身调用的静态方法，不能在类的实例中调用
    return new IO(value);
  }
  map(f) {
    //如果f返回的是一个函子，join()保证flatMap总是返回一个单层的函子，这意味着嵌套的函子会被铺平
    return IO.of(compose(f, this.value));
  }
}

var fs = require("fs");
var readFile = function (filename) {
  console.log("execute readfile");
  return fs.readFileSync(filename, "utf-8");
};
var head = function (x) {
  console.log("execute head");
  return "A " + x;
};
var tail = function (x) {
  console.log("execute tail");
  return x + " B";
};

var readFileIO = function (filename) {
  return new IO(() => readFile(filename));
};
var headIO = function (x) {
  return IO.of(() => head(x));
};
var tailIO = function (x) {
  return IO.of(() => tail(x));
};

console.log(  //下面是单步打印结果
  readFileIO("./user.txt") //IO { value: readfile }
    .flatMap(headIO) // compose(headIO, readfile)
    () // execute readfile  IO { value: head }  //取出readfile的值（readfile被执行）返回一个单层的函子headIO
    .flatMap(tailIO) //compose(tailIO, head)
    () // execute head IO { value: tail } //取出head的值(head被执行)，返回一个单层的函子tailIO
    .value() //execute tail A hello B
);

~~~

