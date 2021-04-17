import React, { createContext, useState } from "react";
import { AuthResponse } from "../../types";

interface AuthContextInterface {
  authState: AuthResponse;
  setAuthState: (info: AuthResponse) => void;
  isAuthenticated: () => boolean;
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

  const [authState, setAuthState] = useState<AuthResponse>({
    token,
    expiresAt: expiresAt ? Number(expiresAt) : null,
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  } as AuthResponse);

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

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (info) => setAuthInfo(info),
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
