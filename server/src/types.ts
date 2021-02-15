import { Request } from "express";

export interface Exercise {
  name?: string;
  sets?: number;
  repsPerSet?: number[];
  distance?: number;
}

export interface Workout {
  exercises?: Exercise[];
  workoutType: "cardio" | "lifting";
  duration?: number;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
