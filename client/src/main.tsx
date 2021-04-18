import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AxiosProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AxiosProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
