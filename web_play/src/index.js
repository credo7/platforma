import "./Common/services/functions";

import React from "react";
import ReactDOM from "react-dom";

import { stopReportingRuntimeErrors } from "react-error-overlay";

import reportWebVitals from "./Common/services/reportWebVitals";
import Providers from "1";

const DEV = process.env.NODE_ENV !== "production";

if (DEV) {
  document.title = "[DEV] " + document.title;
  // disables error overlays
  // stopReportingRuntimeErrors();
}

ReactDOM.render(<Providers />, document.getElementById("root"));

if (DEV) {
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.info))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(console.debug);
}
