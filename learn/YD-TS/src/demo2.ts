function get<T extends object, K extends keyof T>(o:T,name:K) : T[K]{
  return o[name]
}

const data = {
  name:'11',
  age:'aa'
}

console.log(get(data, 'age2'))

