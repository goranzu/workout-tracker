import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse } from "../../types";
import { useAxios } from "./AxiosContext";

interface AuthContextState {
  userInfo: { username: string } | null | Record<string, never>;
  isAuthenticated: boolean;
}

interface AuthContextInterface {
  authState: AuthContextState;
  setAuthState: (info: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { appAxios } = useAxios();
  const [authState, setAuthState] = useState<AuthContextState>({
    userInfo: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    (async function getUser() {
      try {
        const { data } = await appAxios.get("/user", {
          withCredentials: true,
        });
        setAuthState({
          userInfo: data.data,
          isAuthenticated: true,
        });
      } catch (error) {
        // console.error(error);
        setAuthState({ userInfo: {}, isAuthenticated: false });
      }
    })();
  }, [appAxios]);

  function setAuthInfo(info: AuthResponse): void {
    setAuthState({
      userInfo: info.userInfo,
      isAuthenticated: !!info.userInfo.id,
    });
  }

  async function logout() {
    try {
      await appAxios.delete("/logout");
      // Set to empty object... not null or undefined
      setAuthState({
        userInfo: {},
        isAuthenticated: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (info) => setAuthInfo(info),
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
