new Promise((resolve) => {
  resolve();
})
  .then(() => {
    new Promise((resolve) => {
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
        return Promise.resolve();
      })
      .then(() => console.log("log: 内部第二个then"));
  })
  .then(() => console.log("log: 外部第二个then"));

/*结果
log: 内部第一个then
log: 外部第二个then
log: 内部第二个then
 */
