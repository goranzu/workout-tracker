import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({
  children,
  path,
  exact = false,
}: {
  children: React.ReactNode;
  path: string;
  exact?: boolean;
}): JSX.Element {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      path={path}
      exact={exact}
      render={() => {
        if (isAuthenticated()) {
          return children;
        } else {
          return <Redirect to="/" />;
        }
      }}
    ></Route>
  );
}
