// var a = 0;
// async function test() {
//     let result = await 10 + a;
//     console.log(result);
// }
// test();
// a = a + 1;


// setTimeout(function () {
//     console.log('a');
// }, 0);
// new Promise(function (resolve) {
//     console.log('b');
//     new Promise(function (resolve) {
//         console.log('c');

//         setTimeout(() => {
//             console.log('setTimeoutDone');
//             resolve('done');
//         }, 0);

//         resolve();
//     }).then(() => {
//         console.log('d');
//     });
//     resolve();
// }).then(() => {
//     console.log('e');
// });
// console.log('f');


//每次事件循环，首先需要把微任务队列清空，才能执行宏任务

// setTimeout(function(){
//     console.log('a')
//   },0)
// new Promise(function(resolve){
//     console.log('b')
// resolve()
// }).then(()=>{
//     console.log('c')
// })
// console.log('d');



// new Promise((res) => {
//     res()
// }).then(() => {
//     while (true) {

//     }
// });
// setTimeout(() => {
//     console.log(123)
// })

// <template></template>
// <script>
// import xxx from "xx"
//     const ss=new xxx();
//     export {
//         data(){
//             return {
//                ss:ss 
//             }
//         }
//     }
// </script>




// function test(a){
//     var b=Math.sin(a);
//     console.log(b)
// }
// test(30);

console.log(0.5)