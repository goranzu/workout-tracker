import React, { useState } from "react";
import { useForm } from "../../lib/useForm";
import LiftingWorkoutFormSection from "../LiftingWorkoutFormSection";

const workoutTypes = [
  {
    name: "Cardio",
    value: "cardio",
  },
  {
    name: "Lifting",
    value: "lifting",
  },
];

export default function CreateWorkout(): JSX.Element {
  const [type, setType] = useState<"cardio" | "lifting">("cardio");
  const [liftingWorkoutInputList, setLiftingWorkoutInputList] = useState<any[]>(
    [],
  );

  const {
    getFieldProps: getMetaFieldProps,
    getFieldsValue: getMetaFieldValue,
  } = useForm({ date: "", duration: "" });

  const {
    getFieldProps: getCardioFieldProps,
    getFieldsValue: getCardioFieldValue,
  } = useForm({ name: "", distance: "" });

  return (
    <form
      action="POST"
      onSubmit={(e) => {
        e.preventDefault();
        const meta = { ...getMetaFieldValue, type };
        const exercises = [{ ...getCardioFieldValue }];
        const workout = {
          workoutType: meta.type,
          userInputDate: meta.date,
          duration: meta.duration,
          exercises: { ...exercises },
        };
        console.log(workout);
      }}
    >
      <h2>Create Workout</h2>
      <fieldset>
        <label htmlFor="date">
          Date of the workout
          <input type="date" {...getMetaFieldProps("date")} />
        </label>

        <label htmlFor="type">
          Type of workout:
          <select
            onBlur={(e) => {
              const { value } = e.target;
              if (value !== "cardio" && value !== "lifting") {
                return;
              }
              setType(value);
            }}
            name="type"
          >
            {workoutTypes.map((type) => (
              <option value={type.value} key={type.value}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="duration">
          Duration of the workout?
          <input type="number" {...getMetaFieldProps("duration")} />
        </label>
        <hr />
        <h3>Exercises</h3>

        {type === "cardio" && (
          <>
            <label htmlFor="name">
              Name
              <input type="text" {...getCardioFieldProps("name")} />
            </label>

            <label htmlFor="distance">
              Distance
              <input type="number" {...getCardioFieldProps("distance")} />
            </label>
          </>
        )}
        {type === "lifting" && (
          <>
            {liftingWorkoutInputList}
            <div>
              <button
                type="button"
                onClick={() => {
                  setLiftingWorkoutInputList(
                    liftingWorkoutInputList.concat(
                      <LiftingWorkoutFormSection
                        key={liftingWorkoutInputList.length}
                      />,
                    ),
                  );
                }}
              >
                Add More
              </button>
            </div>
          </>
        )}
        <hr />
        <button type="submit">Create Workout</button>
      </fieldset>
    </form>
  );
}
