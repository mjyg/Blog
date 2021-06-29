import React from "react";
import store from "../store";
import { Provider } from "react-redux";
import ReduxCounter from "./ReduxCounter";

class ReduxComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/*通过Provider传入store*/}
        <Provider store={store}>
          <ReduxCounter />
        </Provider>
      </div>
    );
  }
}

export default ReduxComponent;
