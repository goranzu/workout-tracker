import mongoose, { Document } from "mongoose";
import { Workout } from "../../types";

interface WorkoutDocument extends Workout, Document {}

const WorkoutSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  exercise: [
    {
      name: String,
      sets: Number,
      repsPerSet: [Number],
    },
  ],
  type: {
    enum: ["running", "lifting"],
    required: true,
  },
  duration: {
    type: Number,
  },
});

const Workout = mongoose.model<WorkoutDocument>("Workout", WorkoutSchema);

export default Workout;
