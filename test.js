const obj = {}

let a = '1'

function f(val){
  let b
  Object.defineProperty(obj, 'age', {
    get(){
      return b
    },
    set(newVal) {
      console.log('1111', newVal)
      b=newVal
    }
  })
}



f(a)

obj.age = '3'

console.log(a,obj.age)