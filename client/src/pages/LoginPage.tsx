import React, { useState } from "react";
import Form from "../components/form/Form";
import { useForm } from "../lib/useForm";
import { AuthAxiosResponse } from "../../types";
import { Redirect } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";

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
      <main>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>Login</h1>
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
