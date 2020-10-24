const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

//promise解决过程
function promiseResolutionProcedure(promise2, x, resolve, reject) {
  //处理then中的循环promise
  if (x === promise2) {
    throw new Error("Chaining cycle detected for promise ");
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

class myPromise {
  static all(promiseArray) {
    return new Promise((resolve, reject) => {
      const resultArray = []; //保存结果
      let successTimes = 0;

      function processResult(index, data) {
        resultArray[index] = data;
        successTimes++;
        if (successTimes === promiseArray.length) {
          //所有的promise执行成功
          resolve(resultArray);
        }
      }

      for (let i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(
          (data) => processResult(i, data),
          (err) => reject(err)
        );
      }
    });
  }

  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.resolveCallbacks = [];
    this.rejectedCallbacks = [];
    const resolve = (val) => {
      //判断val是否是对象或者函数
      if (typeof val === "object" || typeof val === "function") {
        promiseResolutionProcedure(this, val, resolve, reject);
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
}

const promise = new Promise((resolve, reject) => {
  resolve("step1");
});
setTimeout(() => {
  promise.then((data) => console.log(data));
  promise.then((data) => console.log(data));
}, 1000);
