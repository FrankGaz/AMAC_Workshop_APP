// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min";
import "./i18n";
import React from "react";
import ReactDOM from "react-dom";
// import "@fortawesome/fontawesome-free/css/all.css";

import App from "./App";
import 'bulma/css/bulma.min.css';
//import 'react-bulma-components/dist/react-bulma-components.min.css';
import "./index.css";
import { HashRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(far, fab, fas);

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
