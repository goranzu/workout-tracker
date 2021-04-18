import React, { createContext, useContext, useState } from "react";
import { AuthResponse } from "../../types";

interface AuthContextState {
  userInfo: { username: string } | null;
  token: string | null;
  expiresAt: number | null;
}

interface AuthContextInterface {
  authState: AuthContextState;
  setAuthState: (info: AuthResponse) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");
  const userInfo = localStorage.getItem("userInfo");

  const [authState, setAuthState] = useState({
    token,
    expiresAt: expiresAt ? Number(expiresAt) : null,
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  });

  function setAuthInfo(info: AuthResponse): void {
    localStorage.setItem("token", info.token);
    localStorage.setItem("expiresAt", String(info.expiresAt));
    localStorage.setItem("userInfo", JSON.stringify(info.userInfo));
    setAuthState(info);
  }

  function isAuthenticated(): boolean {
    if (!authState.expiresAt || !authState.token) {
      return false;
    }

    return new Date().getTime() / 1000 < authState.expiresAt;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("userInfo");
    setAuthState({
      expiresAt: null,
      token: null,
      userInfo: null,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (info) => setAuthInfo(info),
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextInterface {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuth };
