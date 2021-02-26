import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    prisma: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      | boolean
      | ((error: Error) => Error)
      | Prisma.RejectPerOperation
      | undefined
    >;
  }
  // interface Response {
  //   myField?: string;
  // }
}

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
