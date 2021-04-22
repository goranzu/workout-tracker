import React from "react";
import { useGetAllWorkouts } from "../lib/useWorkout";

export default function DashboardPage(): JSX.Element {
  //   TODO: Handle Errors
  const { data, status } = useGetAllWorkouts();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>show previous workouts here</p>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Something went wrong...</p>}
      {status === "success" &&
        data?.data.data.map((workout) => (
          <article key={workout.id}>
            <p>Workout Type: {workout.workoutType}</p>
            <p>Date: {workout.date}</p>
            <p>Duration: {workout.duration}</p>
            {workout.exercises.map((ex) => (
              <div key={ex.id}>
                <p>Exercises done this workout!</p>
                <p>Name: {ex.name}</p>
                <p>Distance: {ex.distance}</p>
              </div>
            ))}
          </article>
        ))}
    </main>
  );
}
