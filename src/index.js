import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import logger from './services/logService';

// Raven.config("https://05323d37c9a947eba9daaaab1e6171a9@sentry.io/1249956", {
//     release: '1-0-0',
//     environment: 'development-test',
// }).install();

//Initialising the logger from Logservice.js
logger.init();

ReactDOM.render(<App />, document.getElementById("root"));

