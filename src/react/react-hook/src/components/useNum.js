import {useEffect, useState} from 'react'

export default function useNum(){
  let [num, setNum] = useState(0)
  useEffect(()=>{
    setTimeout(()=>{
      setNum(num=>num + 1)
    }, 1000)
  })
  return [num, setNum]
}