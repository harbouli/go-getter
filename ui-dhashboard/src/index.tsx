import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { Provider } from "react-redux";
import { store } from "store";
import App from "App";

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
