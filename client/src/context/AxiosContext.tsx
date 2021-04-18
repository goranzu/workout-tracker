import React, { createContext, useContext, useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { endpoint } from "../config";

interface AxiosContextInterface {
  appAxios: AxiosInstance;
}

const AxiosContext = createContext({} as AxiosContextInterface);

type AxiosProviderProps = {
  children: React.ReactNode;
};

function AxiosProvider({ children }: AxiosProviderProps): JSX.Element {
  const appAxios = axios.create({ baseURL: endpoint, withCredentials: true });

  useEffect(() => {
    (async function getCsrfToken() {
      try {
        const { data } = await appAxios.get("/csrf-token");
        appAxios.defaults.headers["X-CSRF-Token"] = data.data.csrfToken;
      } catch (error) {
        console.error(error);
      }
    })();
  }, [appAxios]);

  return (
    <AxiosContext.Provider value={{ appAxios }}>
      {children}
    </AxiosContext.Provider>
  );
}

function useAxios(): AxiosContextInterface {
  return useContext(AxiosContext);
}

export { AxiosContext, AxiosProvider, useAxios };
