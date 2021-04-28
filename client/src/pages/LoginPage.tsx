import React, { useState } from "react";
import { useForm } from "../lib/useForm";
import { AuthAxiosResponse } from "../../types";
import { Redirect } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import Wrapper from "../components/wrapper/Wrapper";
import { Link } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import Button from "../components/button/Button";
import { AuthErrorInterface, authSchema } from "./RegisterPage";
import formatErrors from "../lib/formatErrors";

export default function LoginPage(): JSX.Element {
  const { getFieldProps, getFieldsValue } = useForm({
    username: "",
    password: "",
  });
  const { setAuthState } = useAuth();
  const { appAxios } = useAxios();

  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState<AuthErrorInterface>({
    username: [],
    password: [],
  });

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
              try {
                // TODO: Give user a message that signup was successfull
                await authSchema.validate(
                  {
                    username,
                    password,
                  },
                  { abortEarly: false },
                );

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
                // console.error(error);
                // TODO: Handle network error
                if (error.inner) {
                  setErrors(formatErrors<AuthErrorInterface>(error.inner));
                }
                setIsLoading(false);
              }
            }}
          >
            <fieldset disabled={isLoading} aria-busy={isLoading}>
              <label htmlFor="username">
                Username
                <input
                  className={`fs-300`}
                  {...getFieldProps("username")}
                  type="text"
                />
                <ErrorText visible={errors.username.length > 0}>
                  {errors.username[0]}
                </ErrorText>
              </label>
              <label htmlFor="password">
                Password
                <input
                  className={`fs-300`}
                  {...getFieldProps("password")}
                  type="password"
                />
                <ErrorText visible={errors.password.length > 0}>
                  {errors.password[0]}
                </ErrorText>
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
