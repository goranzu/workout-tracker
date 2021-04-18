import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContex";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
