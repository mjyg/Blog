function Batcher() {
  this.reset();
}

Batcher.prototype.reset = function () {
  this.has = {}; //记录已加入批处理的watcher的id
  this.queue = []; //保存所有的watcher
};

Batcher.prototype.push = function (job) {
  // 已经添加过不需要再处理
  if (!this.has[job.id]) {
    this.has[job.id] = true;
    this.queue.push(job);
    if ("Promise" in window) {
      Promise.resolve().then(() => {
        this.flush();
      });
    } else {
      setTimeout(() => {
        this.flush();
      });
    }
  }
};

// 执行所有的job
Batcher.prototype.flush = function () {
  this.queue.forEach(function (job) {
    job.cb();
  });
  this.reset();
};
