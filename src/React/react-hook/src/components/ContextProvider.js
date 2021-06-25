import React, { createContext, useState } from "react";

export const context = createContext({});

//顶层组件
export function ContextProvider({ children }) {
  const [count, setCount] = useState(10);
  const countVal = {
    count,
    setCount,
    add: () => {
      setCount(count + 1);
    },
    reduce: () => setCount(count - 1),
  };
  // context对象中，提供了一个自带的Provider组件
  return <context.Provider value={countVal}>{children}</context.Provider>;
}
