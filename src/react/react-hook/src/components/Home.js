import React from "react";
import { Route, Link } from "react-router-dom";

import { About } from "./About";
import { Info } from "./Info";

export function Home(props) {
  return (
    <div>
      <h1>我是Home组件</h1>
      <div>
        <Link to={`${props.match.path}/one`}>二级路由一</Link>
        <Link to="/home/two">二级路由二</Link>
      </div>
      <Route path={`${props.match.path}/one`} component={About} />
      <Route path="/home/two" component={Info} />
    </div>
  );
}
