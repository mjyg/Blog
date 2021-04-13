```js
//手写Promise
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    this.status = PENDING; //状态
    this.value = undefined; //保存成功的状态值
    this.reason = undefined; //保存失败的状态值

    this.onResolvedCallbacks = []; //保存成功的回调
    this.onRejectedCallbacks = []; //保存失败的回调

    // 调用此方法就是成功
    let resolve = value => {
      // 状态为 PENDING 时才可以更新状态，防止 executor 中调用了两次 resovle/reject 方法
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        //执行回调函数
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    // 调用此方法就是失败
    let reject = reason => {
      // 状态为 PENDING 时才可以更新状态，防止 executor 中调用了两次 resovle/reject 方法
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        //执行回调函数
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      // 立即执行，将 resolve 和 reject 函数传给使用者
      executor(resolve, reject);
    } catch (err) {
      // 发生异常时执行失败逻辑
      reject(err);
    }
  }

  // 包含一个 then 方法，并接收两个参数 onFulfilled、onRejected
  then(onFullfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFullfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }

    //处理异步情况，当在executor()中resolve()或rejected()包裹在异步函数中，则执行到then()时，
    //promise的状态还是pending,需要在这里保存一下成功和失败的回调，到resolve()和resolve()执行完之
    // 后再执行
    if (this.status === PENDING) {
      this.onResolvedCallbacks.push(() => onFullfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 0);
}).then(
  data => {
    console.log('success', data);
  },
  err => {
    console.log('failed', err);
  }
);

```
