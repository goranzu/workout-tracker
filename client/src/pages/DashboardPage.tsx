import React, { useEffect } from "react";
import { useAxios } from "../context/AxiosContex";

export default function DashboardPage(): JSX.Element {
  const { authAxios } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get("/protect");
        console.log(data);
      } catch (error) {
        console.error(error.response);
      }
    })();
  }, [authAxios]);

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
