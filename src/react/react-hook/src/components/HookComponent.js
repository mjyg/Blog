import React from "react";
import useNum from "./useNum";

export function HookComponent() {
  const [num, setNum] = useNum();
  console.log(num);
  console.log(setNum);
  return <div></div>;
}
