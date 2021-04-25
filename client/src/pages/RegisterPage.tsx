import React, { useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { AuthAxiosResponse } from "../../types";
import Button from "../components/button/Button";
import ErrorText from "../components/ErrorText";
import Wrapper from "../components/wrapper/Wrapper";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import { useForm } from "../lib/useForm";

export default function RegisterPage(): JSX.Element {
  const { getFieldProps, getFieldsValue } = useForm({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { setAuthState } = useAuth();
  const { appAxios } = useAxios();

  return (
    <>
      {redirect && <Redirect to="/dashboard" />}
      <main className="registerPage split">
        <Wrapper>
          <h1 className="fs-700">Create an account</h1>
          <form
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault();
              const { username, password } = getFieldsValue;
              if (!username || !password) {
                return;
              }
              try {
                setIsLoading(true);
                const { data } = await appAxios.post<AuthAxiosResponse>(
                  "/register",
                  {
                    username,
                    password,
                  },
                );
                // TODO: Give user a message that signup was successfull
                // TODO: Handle Errors
                setAuthState(data.data);
                setIsLoading(false);
                setRedirect(true);
              } catch (error) {
                console.error(error.response);
                setIsLoading(false);
              }
            }}
          >
            <fieldset>
              <label htmlFor="username">
                Username
                <input {...getFieldProps("username")} type="text" />
                <ErrorText visible={false}>Required field...</ErrorText>
              </label>
              <label htmlFor="password">
                Password
                <input {...getFieldProps("password")} type="password" />
                <ErrorText visible={false}>Required field...</ErrorText>
              </label>
              <p className={`fs-200`}>
                Already have an account? Click{" "}
                <span>
                  <Link to="/login">here</Link>
                </span>{" "}
                to login.
              </p>
              <Button type="submit">Register</Button>
            </fieldset>
          </form>
        </Wrapper>
      </main>
    </>
  );
}
