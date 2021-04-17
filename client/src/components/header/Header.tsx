import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import classes from "./header.module.css";

export default function Header(): JSX.Element {
  const { authState, isAuthenticated } = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <p>workout tracker</p>
      {isAuthenticated() && <p>{authState.userInfo?.username}</p>}
      <nav>
        {isAuthenticated() ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
