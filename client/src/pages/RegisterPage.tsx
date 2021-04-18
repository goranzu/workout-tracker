import React, { useState } from "react";
import { Redirect } from "react-router";
import { AuthAxiosResponse } from "../../types";
import Form from "../components/form/Form";
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
      <main>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>Register</h1>
        <Form
          isLoading={isLoading}
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
              setRedirect(true);
              setIsLoading(false);
              console.log(data);
            } catch (error) {
              console.error(error.response);
              setIsLoading(false);
            }
          }}
        >
          <label htmlFor="username">
            Username
            <input {...getFieldProps("username")} type="text" />
          </label>
          <label htmlFor="password">
            Password
            <input {...getFieldProps("password")} type="password" />
          </label>
          <button type="submit">Login</button>
        </Form>
      </main>
    </>
  );
}
