import * as React from 'react'
import Routes from '../routes'
import {BrowserRouter} from 'react-router-dom'

const App = ()=>{
  return <BrowserRouter basename='/' >{Routes()}</BrowserRouter>
}

export default App