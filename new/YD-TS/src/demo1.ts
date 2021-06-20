function test(){
  const res:string = 'aa'
  const age:number=1
  // return [res,age] as const  // 转成常量
  // return <const>[res,age]  //泛型
  return tuplify(res,age)
}

const items = test()
const [res] = items

function tuplify<T extends unknown[]>(...elements:T[]):T{
  return elements
}

function useFetch(){
  return []
}

function sun(){

}

//伴侣模式
type OrderId = string & { readonly brand: unique symbol}
type UserId = string & { readonly brand: unique symbol}

type ID = OrderId | UserId

function OrderId(id:string){
  return id as OrderId
}

function UserId(id:string){
  return id as UserId
}

function queryForUser(id:ID){

}

queryForUser(UserId('aa'))