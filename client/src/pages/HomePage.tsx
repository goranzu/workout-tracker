import React from "react";
import { Redirect } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function HomePage(): JSX.Element {
  const { authState } = useAuth();

  return (
    <>
      {authState.isAuthenticated && <Redirect to="/dashboard" />}
      <main>
        <h1>HomePage</h1>
      </main>
    </>
  );
}
