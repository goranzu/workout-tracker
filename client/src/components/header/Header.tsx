import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../button/Button";
import Wrapper from "../wrapper/Wrapper";
import classes from "./header.module.css";

export default function Header(): JSX.Element {
  const { authState, logout } = useAuth();

  const history = useHistory();
  return (
    <header className={classes.header}>
      <Wrapper>
        <div className={classes.logo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 35 35"
          >
            <g
              id="Group_1"
              data-name="Group 1"
              transform="translate(-368.5 -31.5)"
            >
              <rect
                id="Rectangle_329"
                data-name="Rectangle 329"
                width="10"
                height="10"
                transform="translate(369 32)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_334"
                data-name="Rectangle 334"
                width="10"
                height="10"
                transform="translate(369 44)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_337"
                data-name="Rectangle 337"
                width="10"
                height="10"
                transform="translate(369 56)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_330"
                data-name="Rectangle 330"
                width="10"
                height="10"
                transform="translate(381 32)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_333"
                data-name="Rectangle 333"
                width="10"
                height="10"
                transform="translate(381 44)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_336"
                data-name="Rectangle 336"
                width="10"
                height="10"
                transform="translate(381 56)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_331"
                data-name="Rectangle 331"
                width="10"
                height="10"
                transform="translate(393 32)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_332"
                data-name="Rectangle 332"
                width="10"
                height="10"
                transform="translate(393 44)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <rect
                id="Rectangle_335"
                data-name="Rectangle 335"
                width="10"
                height="10"
                transform="translate(393 56)"
                fill="#3b4252"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
            </g>
          </svg>
          <span className="bold fs-500">WorkoutTracker</span>
        </div>
        <div className={classes.right}>
          {authState.userInfo?.username && (
            <p className={classes.username}>{authState.userInfo.username}</p>
          )}
          {!authState.isAuthenticated ? (
            <nav>
              <Link to={"/register"}>Register</Link>
              <Link to={"/login"}>Login</Link>
            </nav>
          ) : null}
          {authState.isAuthenticated && (
            <Button
              type="button"
              variant="small"
              onClick={async () => {
                await logout();
                history.push("/login");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Wrapper>
    </header>
  );
}
