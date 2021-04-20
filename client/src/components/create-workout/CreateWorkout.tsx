import React from "react";

export default function CreateWorkout(): JSX.Element {
  return (
    <form action="POST">
      <h2>Create Workout</h2>
      <fieldset>
        <label htmlFor="type">Type of workout:</label>
        <select name="type" id="type">
          <option value="cardio">Cardio</option>
          <option value="lifting">Lifting</option>
        </select>
      </fieldset>
    </form>
  );
}
