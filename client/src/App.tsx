import React, { lazy, Suspense } from "react";
import { Switch, Route, Link } from "react-router-dom";
import CreateWorkout from "./components/create-workout/CreateWorkout";
import Header from "./components/header/Header";
import PrivateRoute from "./components/PrivateRoute";
import Wrapper from "./components/wrapper/Wrapper";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));

export default function App(): JSX.Element {
  const { authState } = useAuth();
  if (authState.userInfo == null) {
    return <div>Loading...</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
        <PrivateRoute path="/dashboard" exact>
          <Wrapper>
            <DashboardPage />
          </Wrapper>
        </PrivateRoute>
        <PrivateRoute path="/dashboard/create-workout" exact>
          <Wrapper>
            <CreateWorkout />
          </Wrapper>
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
    </Suspense>
  );
}
