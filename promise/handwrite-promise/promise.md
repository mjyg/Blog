# 十一步大白话手写Promise

**目录**
> * [第一步：包含成功回调）](#第一步)
> * [第二步：增加Promise的状态(state)](#第二步)
> * [第三步：增加存放当前状态的值(value)](#第三步)
> * [第四步：多次执行resolve时，只有第一次生效](#第四步)
> * [第五步：then的链式调用和值的穿透性](#第五步)
> * [第六步：实现空的then](#第六步)
> * [第七步：实现thenable特性](#第七步)
> * [第八步：支持resolve传递promise对象](#第八步)
> * [第九步：处理then中的循环promise](#第九步)
> * [第十步：支持静态方法Promise.all](#第十步)
> * [第十一步：支持reject](#第十一步)
> * [第十二步：支持处理完成态或失败态](#第十二步)


## 第一步
——包含成功回调
先写一个仅包含成功回调的最简单的Promise:
```js
new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("step1");
  }, 1000);
}).then((data) => {
  console.log(data);
});
```
实现：
```js
class myPromise {
  constructor(fn) {
    this.resolveCallbacks = [];
    const resolve = (val) => {
      this.resolveCallbacks.map((fn) => fn(val));
    };
    const reject = () => {};
    fn(resolve, reject);
  }

  then(onFulfilled) {
    this.resolveCallbacks.push(onFulfilled);
  }
}
```

## 第二步
——增加Promise的状态(state)
Promise包含三种状态：等待（pending），执行（fulfilled），拒绝（rejected）
```js
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class myPromise {
  constructor(fn) {
    this.state = PENDING
    this.resolveCallbacks = [];
    const resolve = (val) => {
      this.state = FULFILLED
      this.resolveCallbacks.map((fn) => fn(val));
    };
    const reject = () => {
      this.state = REJECTED
    };
    fn(resolve, reject);
  }

  then(onFulfilled) {
    //当是PENDING状态时才挂载
    if(this.state === PENDING) {
      this.resolveCallbacks.push(onFulfilled);
    }
  }
}
```

## 第三步
——增加存放当前状态的值(value)
```js
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class myPromise {
  constructor(fn) {
    this.state = PENDING
    this.value = undefined
    this.resolveCallbacks = [];
    const resolve = (val) => {
      this.value = val
      this.state = FULFILLED
      this.resolveCallbacks.map((fn) => fn(val));
    };
    const reject = (val) => {
      this.value = val
      this.state = REJECTED
    };
    fn(resolve, reject);
  }

  then(onFulfilled) {
    //当是PENDING状态时才挂载
    if(this.state === PENDING) {
      this.resolveCallbacks.push(onFulfilled);
    }
  }
}
```
📚 问题：当把myPromise实例中的setTimeout去掉，改成如下：
```js
new myPromise((resolve, reject) => {
    resolve("step1");
}).then((data) => {
  console.log(data);
});
```
运行不会打印任何东西，因为执行resolve时，resolveCallbacks还没来得及挂载then里传入的函数，需要把
setTimeout加到resolve的实现中：
```js
class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      setTimeout(() => {
        this.value = val;
        this.state = FULFILLED;
        this.resolveCallbacks.map((fn) => fn(val));
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      this.resolveCallbacks.push(onFulfilled);
    }
  }
}
```
这样就会先执行then(),把onFulfilled先挂载到resolveCallbacks上,再执行resolve()

## 第四步
——多次执行resolve时，只有第一次生效
在刚刚手写的promise中多次调用resolve：
```js
new myPromise((resolve, reject) => {
  resolve("step1");
  resolve('step2')
}).then((data) => {
  console.log(data);
});
/*
step1
step2
*/
```
可以看到打印了两次，但在官方的Promise中只有第一次会生效，在resolve的实现中加入状态判断，只有在Pending
状态时才执行，便可保证只执行依次resolve()
```js
class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      setTimeout(() => {
        //pending状态时才执行
        if(this.state === "PENDING") {
          this.value = val;
          this.state = FULFILLED;
          this.resolveCallbacks.map((fn) => fn(val));
        }
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      this.resolveCallbacks.push(onFulfilled);
    }
  }
}
```

## 第五步
——then的链式调用和值的穿透性
官方的Promise的then方法支持链式调用，而且后一个可以拿到前一个then的返回结果，这叫做值的穿透性，如下：
```js
new myPromise((resolve, reject) => {
  resolve("step1");
}).then((data) => {
  console.log(data);
  return("step2")
}).then((data)=>{
  console.log(data)
});
/*
step1
step2
*/
```
要想实现这样的效果，必须在then的实现里返回一个新的promise:
```js
class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      console.log('resolve开始')
      setTimeout(() => {
        //pending状态时才执行
        if (this.state === "PENDING") {
          console.log('resolve里的setTimeout', val)
          this.value = val;
          this.state = FULFILLED;
          this.resolveCallbacks.map((fn) => fn());
        }
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      return new myPromise((resolve, reject) => {
        console.log('then',this.value)
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const re = onFulfilled(this.value);
          resolve(re);
        });
      });
    }
  }
}

new myPromise((resolve, reject) => {
  resolve("step1");
})
  .then((data) => {
    console.log('onFulfilled1')
    console.log(data);
    return "step2";
  })
  .then((data) => {
    console.log('onFulfilled2')
    console.log(data);
  });
```
为了方便理解，加了些打印，结果如下：
> resolve开始  
> then undefined
> then undefined
> resolve里的setTimeout step1
> onFulfilled1
> step1
> resolve开始
> resolve里的setTimeout step2
> onFulfilled2
> step2
> resolve开始
> resolve里的setTimeout undefined

## 第六步
——实现空的then
官方的promise可以接空的thenl来实现值得透传：
```js
new Promise((resolve, reject) => {
  resolve("step1");
})
  .then((data) => {
    console.log(data);
    return "step2";
  })
  .then()  //空的then
  .then((data) => {
    console.log(data);
  });
/*
step1
step2
*/
```
要实现这个效果，当then参数为空时，需要给then的实现加默认参数，并返回上一个then的结果：
```js
class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      setTimeout(() => {
        //pending状态时才执行
        if (this.state === "PENDING") {
          this.value = val;
          this.state = FULFILLED;
          this.resolveCallbacks.map((fn) => fn());
        }
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled = val => val) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      return new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const re = onFulfilled(this.value);
          resolve(re);
        });
      });
    }
  }
}
```
## 第七步
——实现thenable特性
通过查阅官方文档，如果onFulFilled或者onRejected返回一个值x，则执行Promise解决过程<br>
Promise解决过程是一个抽象操作，如果x有then方法且看上去像一个Promise，解决程序即尝试使promise
接受x的状态，否则其用x的值来执行promise，这种thenable特性使得Promise的特性更具有通用性<br>
x有以下几种形式：
* 1.当x为对象或者函数时，会给x注入resolve和resolve两个参数，如果resolve方法被调用，就返回resolve
的参数值,并会传递给后面的then
```js
new Promise((resolve, reject) => {
  resolve("step1");
})
  .then((data) => {
    console.log(data);  //step1
    return {
      then(r,j) {
        r("step2");
      },
    };
  })
  .then((data) => {
    console.log(data);  //step2
  });
```
在实现时，需要对onFulfilled的返回值x做判断，如果是一个对象或者函数时，调用x的then方法，对then
的第一个参数调用resolve方法，第二个参数调用reject方法
```js

class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      setTimeout(() => {
        //pending状态时才执行
        if (this.state === "PENDING") {
          this.value = val;
          this.state = FULFILLED;
          this.resolveCallbacks.map((fn) => fn());
        }
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled = (val) => val) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      return new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const x = onFulfilled(this.value);
          //实现thenable特性，判断x是否是对象或者函数
          if (
            (typeof x === "object" || typeof x === "function") &&
            x !== null
          ) {
            //判断x.then是否是一个方法
            if (typeof x.then === "function") {
              x.then((y) => resolve(y));
            } else {
              resolve(x);
            }
          } else {
            resolve(x);
          }
        });
      });
    }
  }
}
```
在上面的实现中，如果y也是一个promise呢，所以需要写一个函数来实现promise的解决过程，方便递归调用
```js
//promise解决过程
function promiseResolutionProcedure(promise2, x, resolve, reject) {
  //实现thenable特性，判断x是否是对象或者函数
  if ((typeof x === "object" || typeof x === "function") && x !== null) {
    //判断x.then是否是一个方法
    if (typeof x.then === "function") {
      x.then(
        (y) => promiseResolutionProcedure(promise2, y, resolve, reject),
        reject
      ); //如果y也是一个promise，则需要进行递归调用
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
```
改写then的实现：
```js
then(onFulfilled = (val) => val) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      const promise2 = new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const x = onFulfilled(this.value);
          //调用promise解决过程
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
      });
      return promise2;
    }
}
```
* 2.当x为promise对象时:
> 如果x处于等待态，promise需保持为等待态直至x被执行或拒绝
> 如果x处于执行态，用相同的值执行promise
> 如果x处于拒绝态，用相同的原因拒绝promise<br>

使用如下：
```js
new Promise((resolve, reject) => {
  resolve("step1");
})
  .then((data) => {
    console.log(data);  //step1
    return new Promise((resolve) => {
      resolve("step2");
    });
  })
  .then((data) => {
    console.log(data);  //step2
  });
```
修改promiseResolutionProcedure：
```js
//promise解决过程
function promiseResolutionProcedure(promise2, x, resolve, reject) {
  //实现thenable特性
  //处理x为promise对象
  if (x instanceof myPromise) {
    if(x.state === PENDING) {
      x.then(
        (y) => promiseResolutionProcedure(promise2, y, resolve, reject),
        reject
      ); //如果y也是一个promise，则需要进行递归调用
    } else {
      x.state === FULFILLED && resolve(x.value);
      x.state === REJECTED && reject(x.value);
    }
  }
  // 处理x为对象或者函数
  if ((typeof x === "object" || typeof x === "function") && x !== null) {
    //判断x.then是否是一个方法
    if (typeof x.then === "function") {
      x.then(
        (y) => promiseResolutionProcedure(promise2, y, resolve, reject),
        reject
      ); //如果y也是一个promise，则需要进行递归调用
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
```

## 第八步
——支持resolve传递promise对象
当resolve的参数为一个promise对象时，我们希望能传递该promise的resolve值
```js
ew Promise((resolve, reject) => {
  resolve(new Promise(resolve=>resolve('step1')));
})
  .then((data) => {
    console.log(data);  //step1
  });
```
这就需要对resolve的参数做出判断，当参数是一个对象或者函数时，调用promiseResolutionProcedure
```js
class myPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    const resolve = (val) => {
      //判断val是否是对象或者函数
      if(typeof val === 'object' || typeof val === 'function') {
        promiseResolutionProcedure(this, val, resolve, reject)
        return;
      }
      setTimeout(() => {
        //pending状态时才执行
        if (this.state === "PENDING") {
          this.value = val;
          this.state = FULFILLED;
          this.resolveCallbacks.map((fn) => fn());
        }
      }, 1000);
    };
    const reject = (val) => {
      this.value = val;
      this.state = REJECTED;
    };
    fn(resolve, reject);
  }

  then(onFulfilled = (val) => val) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      const promise2 = new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const x = onFulfilled(this.value);
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
      });
      return promise2;
    }
  }
}
```

## 第九步
——处理then中的循环promise
使用原生的promise时，在then中循环引用promise会报错：
```js
const promise = new Promise((resolve, reject) => {
  resolve("step1");
});
const promise1 = promise.then((data) => promise1);
//TypeError: Chaining cycle detected for promise #<Promise>
```
需要在promiseResolutionProcedure对val加判断：
```js
//promise解决过程
function promiseResolutionProcedure(promise2, x, resolve, reject) {
  //处理then中的循环promise
  if(x === promise2) {
    throw new Error('Chaining cycle detected for promise ')
  }

  //实现thenable特性
  //处理x为promise对象
  if (x instanceof myPromise) {
    if (x.state === PENDING) {
      x.then(
        (y) => promiseResolutionProcedure(promise2, y, resolve, reject),
        reject
      ); //如果y也是一个promise，则需要进行递归调用
    } else {
      x.state === FULFILLED && resolve(x.value);
      x.state === REJECTED && reject(x.value);
    }
  }
  // 处理x为对象或者函数
  if ((typeof x === "object" || typeof x === "function") && x !== null) {
    //判断x.then是否是一个方法
    if (typeof x.then === "function") {
      x.then(
        (y) => promiseResolutionProcedure(promise2, y, resolve, reject),
        reject
      ); //如果y也是一个promise，则需要进行递归调用
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
```

## 第十步
——支持静态方法Promise.all
原生的Promise.all方法如下：
```js
const promise1 = new Promise((resolve, reject) => {
  resolve("step1");
});
const promise2 = new Promise((resolve, reject) => {
  resolve("step2");
});
Promise.all([promise1, promise2]).then(data=>console.log(data))
//   [ 'step1', 'step2' ]
```
需要给myPromise类添加一个静态方法，并返回promise对象
```js
static all(promiseArray){
    return new Promise((resolve,reject)=>{
      const resultArray = []; //保存结果
      let successTimes = 0;

      function processResult(index,data){
        resultArray[index] = data;
        successTimes ++;
        if(successTimes === promiseArray.length) {
          //所有的promise执行成功
          resolve(resultArray)
        }
      }

      for(let i =0; i < promiseArray.length;i++) {
        promiseArray[i].then(data=>processResult(i,data),err=>reject(err))
      }
    })
  }
```

## 第十一步
——支持reject
使用官方的reject:
```js
new myPromise((resolve, reject) => {
  reject("error");
}).then(
  (data) => {
    console.log(data);
  },
  (rej) => {
    console.log(rej);  //error
  }
);
```
参照resolve的实现，实现reject:
```js
const reject = (val) => {
      //判断val是否是对象或者函数
      if (typeof val === "object" || typeof val === "function") {
        promiseResolutionProcedure(this, val, resolve, reject);
        return;
      }
      setTimeout(() => {
        //pending状态时才执行
        if (this.state === "PENDING") {
          this.value = val;
          this.state = REJECTED;
          this.rejectedCallbacks.map((fn) => fn());
        }
      }, 1000);
    };
    fn(resolve, reject);
  }

  then(
    onFulfilled = (val) => val,
    onRejected = (err) => {
      throw new Error(err);
    }
  ) {
    //当是PENDING状态时才挂载
    if (this.state === PENDING) {
      //实现then链式调用
      const promise2 = new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const x = onFulfilled(this.value);
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value);
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
      });
      return promise2;
    }
  }
```

## 第十二步
——支持处理完成态或失败态
当异步执行then方法时，需要能正常返回结果：
```js
const promise = new Promise((resolve, reject) => {
  resolve("step1");
});
setTimeout(() => {
  promise.then((data) => console.log(data));
  promise.then((data) => console.log(data));
}, 1000);
/*
step1
step1
*/
```
在myPromise中，由于异步执行到then时，resolve函数已经先执行完了，this.state变成了FULFILLED，
所以还需要在then方法中加入this.state为FULFILLED和REJECT的处理
```js
then(
    onFulfilled = (val) => val,
    onRejected = (err) => {
      throw new Error(err);
    }
  ) {
    let promise2 = null;
    //处理已经完成的promise
    if (this.state === FULFILLED) {
      promise2 = new myPromise((resolve, reject) => {
        const x = onFulfilled(this.value);
        promiseResolutionProcedure(promise2, x, resolve, reject);
      });
    }

    //处理已经完成的promise
    if (this.state === REJECTED) {
      promise2 = new myPromise((resolve, reject) => {
        const x = onRejected(this.value);
        promiseResolutionProcedure(promise2, x, resolve, reject);
      });
    }

    //处理尚未完成的promise
    if (this.state === PENDING) {
      //实现then链式调用
      promise2 = new myPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          //resolve要拿到onFulfilled的返回值，所以这里要执行函数
          const x = onFulfilled(this.value);
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value);
          promiseResolutionProcedure(promise2, x, resolve, reject);
        });
      });
    }
    return promise2;
  }
```
