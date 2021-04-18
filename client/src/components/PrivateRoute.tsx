import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PrivateRouteProps = {
  children: React.ReactNode;
  path: string;
  exact?: boolean;
};

export default function PrivateRoute({
  children,
  path,
  exact = false,
}: PrivateRouteProps): JSX.Element {
  const { authState } = useAuth();
  return (
    <Route
      path={path}
      exact={exact}
      render={() => {
        if (authState.isAuthenticated) {
          return children;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    ></Route>
  );
}
