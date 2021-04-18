import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import classes from "./header.module.css";

export default function Header(): JSX.Element {
  const { authState, isAuthenticated, logout } = useAuth();
  const history = useHistory();
  return (
    <header className={classes.header}>
      <p>workout tracker</p>

      <div className={classes.right}>
        {isAuthenticated() && <p>{authState.userInfo?.username}</p>}
        <nav>
          {isAuthenticated() ? (
            <Link to="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link to={isAuthenticated() ? "/dashboard" : "/register"}>
                Register
              </Link>
              <Link to={isAuthenticated() ? "/dashboard" : "/login"}>
                Login
              </Link>
            </>
          )}
        </nav>
        {isAuthenticated() && (
          <button
            onClick={() => {
              logout();
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
