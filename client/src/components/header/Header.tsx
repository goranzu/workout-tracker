import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import classes from "./header.module.css";

export default function Header(): JSX.Element {
  const { authState, logout } = useAuth();

  const history = useHistory();
  return (
    <header className={classes.header}>
      <p>workout tracker</p>
      <div className={classes.right}>
        {authState.userInfo?.username && <p>{authState.userInfo.username}</p>}
        {!authState.isAuthenticated ? (
          <nav>
            <Link to={"/register"}>Register</Link>
            <Link to={"/login"}>Login</Link>
          </nav>
        ) : null}
        {authState.isAuthenticated && (
          <button
            onClick={async () => {
              await logout();
              history.push("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
