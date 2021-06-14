/**
 * 批处理构造函数
 * @constructor
 */
function Batcher() {
    this.reset();
}


Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};


Batcher.prototype.push = function (job) {
    let id = job.id;//watcher
    if (!this.has[id]) {
        console.log(batcher);
        this.queue.push(job);
        this.has[id] = true;
        if (!this.waiting) {
            this.waiting = true;
            if ("Promise" in window) {
                Promise.resolve().then(() => {
                    this.flush();
                })
            } else {
                setTimeout(() => {
                    this.flush();
                }, 0);
            }
        }
    }
};


Batcher.prototype.flush = function () {
    //所有维护的watcher队列，
    //watcher
    this.queue.forEach((job) => {
        job.cb();
    });
    this.reset();
};