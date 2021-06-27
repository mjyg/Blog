import React from 'react'

export function About(props){
  console.log(props.match.params.id)  //拿到路由中的id
  return <div>
    <h1>我是About组件</h1>
  </div>
}
