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
    userId: string;
  }
}

declare module "express-session" {
  interface Session {
    userId: string;
  }
}

export interface Exercise {
  name: string;
  sets?: number;
  repsPerSet?: number;
  distance?: number;
  weightLifted?: number;
}

export interface Workout {
  exercises?: Exercise[];
  workoutType: "cardio" | "lifting";
  duration?: number;
  userInputDate: string
}

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface AuthBody {
  username: string;
  password: string;
}
