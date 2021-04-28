import React, { useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { AuthAxiosResponse } from "../../types";
import Button from "../components/button/Button";
import ErrorText from "../components/ErrorText";
import Wrapper from "../components/wrapper/Wrapper";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import formatErrors from "../lib/formatErrors";
import { useForm } from "../lib/useForm";

export const authSchema = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(2).required(),
});

export interface AuthErrorInterface {
  username: string[];
  password: string[];
}

export default function RegisterPage(): JSX.Element {
  const { getFieldProps, getFieldsValue } = useForm({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState<AuthErrorInterface>({
    username: [],
    password: [],
  });
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
              setErrors({ username: [], password: [] });
              const { username, password } = getFieldsValue;
              try {
                await authSchema.validate(
                  {
                    username,
                    password,
                  },
                  {
                    abortEarly: false,
                  },
                );

                setIsLoading(true);
                const { data } = await appAxios.post<AuthAxiosResponse>(
                  "/register",
                  {
                    username,
                    password,
                  },
                );

                // TODO: Give user a message that signup was successfull
                setAuthState(data.data);
                setIsLoading(false);
                setRedirect(true);
              } catch (error) {
                // console.error(error);
                // Handle network response error

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
                {
                  <ErrorText visible={errors.username.length > 0}>
                    {errors.username[0]}
                  </ErrorText>
                }
              </label>
              <label htmlFor="password">
                Password
                <input
                  className={`fs-300`}
                  {...getFieldProps("password")}
                  type="password"
                />
                {
                  <ErrorText visible={errors.password.length > 0}>
                    {errors.password[0]}
                  </ErrorText>
                }
              </label>
              <p className={`fs-200 link`}>
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
