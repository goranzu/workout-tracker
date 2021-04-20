import React, { useEffect } from "react";
import { useAxios } from "../context/AxiosContext";

export default function DashboardPage(): JSX.Element {
  const { appAxios } = useAxios();

  useEffect(() => {
    (async function getData() {
      // try {
      //   const { data } = await appAxios.get("/");
      //   console.log(data);
      // } catch (error) {
      //   console.error(error.response);
      // }
    })();
  }, [appAxios]);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>show previous workouts here</p>
    </main>
  );
}
