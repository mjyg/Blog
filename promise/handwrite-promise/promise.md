# 手写Promise

## 第一步：包含成功回调
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

## 第二步：增加Promise的状态(state)
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

## 第三步：增加存放当前状态的值(value)
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

## 第四步：多次执行resolve时，只有第一次生效
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

## 第五步，then的链式调用和值的穿透性
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

