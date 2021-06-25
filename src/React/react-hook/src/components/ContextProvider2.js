import React, { createContext, useState } from "react";

export const context2 = createContext({});

//顶层组件
export function ContextProvider2({ children }) {
  const [value, setValue] = useState(2);
  const val = {
    value,
    setValue,
    reduce: () => setValue(value - 1),
  };
  // context对象中，提供了一个自带的Provider组件
  return <context2.Provider value={val}>{children}</context2.Provider>;
}
