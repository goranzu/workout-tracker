import React from "react";

export default function LiftingWorkoutFormSection(): JSX.Element {
  return (
    <section
      style={{ border: "1px solid black", margin: "1em", padding: "1em" }}
    >
      <label htmlFor="name">
        Name
        <input type="text" name="name" />
      </label>

      <label htmlFor="sets">
        Sets
        <input type="number" name="sets" />
      </label>

      <label htmlFor="repsPerSet">
        Reps per set
        <input type="number" name="repsPerSet" />
      </label>

      <label htmlFor="weightLifted">
        Total weight lifted
        <input type="number" name="weightLifted" />
      </label>
    </section>
  );
}
