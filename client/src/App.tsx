import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "./components/header/Header";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));

export default function App(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/register" exact>
            <RegisterPage />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <PrivateRoute path="/dashboard">
            <DashboardPage />
          </PrivateRoute>
          <Route path="*">
            {() => (
              <main>
                <h1>404 page</h1>
                Click <Link to="/dashboard">here</Link> to go back...
              </main>
            )}
          </Route>
        </Switch>
      </Router>
    </Suspense>
  );
}
