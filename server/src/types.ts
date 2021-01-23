import { Request } from "express";

export interface Exercises {
  name?: string;
  sets?: number;
  repsPerSet?: number[];
  distance?: number;
}

export interface Workout {
  date?: Date;
  exercise?: Exercises[];
  type: "cardio" | "lifting";
  duration?: number;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
