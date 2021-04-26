import React, { useState } from "react";
import Form from "../components/form/Form";
import { useForm } from "../lib/useForm";
import { AuthAxiosResponse } from "../../types";
import { Redirect } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import Wrapper from "../components/wrapper/Wrapper";
import { Link } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import Button from "../components/button/Button";

export default function LoginPage(): JSX.Element {
  const { getFieldProps, getFieldsValue } = useForm({
    username: "",
    password: "",
  });
  const { setAuthState } = useAuth();
  const { appAxios } = useAxios();

  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  return (
    <>
      {redirect && <Redirect to="/dashboard" />}
      <main className="loginPage split">
        <Wrapper>
          <h1 className="fs-700">Login to your account</h1>
          <form
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault();
              const { username, password } = getFieldsValue;
              if (!username || !password) {
                return;
              }
              try {
                // TODO: Give user a message that signup was successfull
                // TODO: Handle Errors
                const { data } = await appAxios.post<AuthAxiosResponse>(
                  "/login",
                  {
                    username,
                    password,
                  },
                );
                setAuthState(data.data);
                setIsLoading(false);
                setRedirect(true);
              } catch (error) {
                console.error(error);
                setIsLoading(false);
              }
            }}
          >
            <fieldset>
              <label htmlFor="username">
                Username
                <input
                  className={`fs-300`}
                  {...getFieldProps("username")}
                  type="text"
                />
                <ErrorText visible={false}>Required field...</ErrorText>
              </label>
              <label htmlFor="password">
                Password
                <input
                  className={`fs-300`}
                  {...getFieldProps("password")}
                  type="password"
                />
                <ErrorText visible={false}>Required field...</ErrorText>
              </label>
              <p className={`fs-200 link`}>
                Don&apos;t have an account? Click{" "}
                <span>
                  <Link to="/register">here</Link>
                </span>{" "}
                to create one.
              </p>
              <Button type="submit">Login</Button>
            </fieldset>
          </form>
        </Wrapper>
        <div className="right"></div>
      </main>
    </>
  );
}
