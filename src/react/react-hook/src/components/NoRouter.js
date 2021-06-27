import React from 'react'
import {
  withRouter
} from "react-router-dom";

export function NoRouter(props){
  console.log(props.history)
  return <div>
    <h1>我是没有路由匹配的组件</h1>
  </div>
}

export default withRouter(NoRouter)