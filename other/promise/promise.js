const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

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

  then(onFulfilled) {
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

new myPromise((resolve, reject) => {
  resolve("step1");
})
  .then((data) => {
    console.log(data);
    return "step2";
  })
  .then((data) => {
    console.log(data);
  });
