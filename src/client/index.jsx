import "@babel/polyfill";
import React from "React";
import ReactDOM from "react-dom";
import { App } from "./components/App/App";

import "./index.scss";
import * as favicon from "./assets/images/favicon.ico";

ReactDOM.render(
    <App />,
    document.getElementById("main")
);