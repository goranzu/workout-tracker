import React, { createContext, useContext } from "react";
import axios, { AxiosInstance } from "axios";
import { endpoint } from "../config";
import { useAuth } from "./AuthContext";

interface AxiosContextInterface {
  authAxios: AxiosInstance;
}

const AxiosContext = createContext({} as AxiosContextInterface);

function AxiosProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { authState } = useAuth();
  const authAxios = axios.create({
    baseURL: endpoint,
  });

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authState.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return (
    <AxiosContext.Provider value={{ authAxios }}>
      {children}
    </AxiosContext.Provider>
  );
}

function useAxios(): AxiosContextInterface {
  return useContext(AxiosContext);
}

export { AxiosContext, AxiosProvider, useAxios };
