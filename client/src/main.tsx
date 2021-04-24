import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContext";
import "./index.css";
import "./typography.css";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <AxiosProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AxiosProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);
