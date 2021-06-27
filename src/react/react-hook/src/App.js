import "./App.css";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Info } from "./components/Info";
import { NotFound } from "./components/NotFound";
import { NoRouter } from "./components/NoRouter";
import {
  BrowserRouter,
  Route,
  Link,
  HashRouter,
  Switch,
  NavLink,
  Redirect,
  WithRouter
} from "react-router-dom";

function App() {
  const isLoginIn = false;
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/info" component={Info} />
      </BrowserRouter>
    </div>
  );
}

export default App;
