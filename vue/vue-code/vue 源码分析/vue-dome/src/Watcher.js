let uid = 0;


//new Watcher(vm, node, name, 'nodeValue');

/**
   vue实例 ，{{text}}，text，'nodeValue'
*/
function Watcher(vm, node, name, type) {

    Dep.target = this;

    this.name = name;//text
    this.id = ++uid;
    this.node = node;//{{text}}
    this.vm = vm;//VM
    this.type = type;//'nodeValue'
    this.update();

    Dep.target = null;
}
// function queueWatcher(watcher){
//     var id = watcher.id;
//     if(has[id]==null){

//     }
// }

Watcher.prototype = {
    update: function () {
        this.get();
        if (!batcher) {
            batcher = new Batcher();
            // console.log(this.node);
            // this.node[this.type] = this.value;
        }
        batcher.push(this);

        // span.nodeValue =  this.vm.text

        // this.node[this.type] = this.value; 

    },
    cb: function () {

        //nodeValue
        //input  value
        console.log("dom update");
        this.node[this.type] = this.value;
    },
    get: function () {
        // vm['text']
        this.value = this.vm[this.name];//get触发 ，watcher ==>已经记录到电话本
    }
}