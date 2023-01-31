import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import Store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/index.css";
import "./assets/css/app.css";

window.$server_url = "https://server.deletemenow.com:8443";
// window.$server_url = "http://localhost:8080";

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
