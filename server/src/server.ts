import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config";
import workoutRouter from "./resources/workout/workout.router";
import { Prisma, PrismaClient } from "@prisma/client";

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

const prisma = new PrismaClient();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

app.get("/", (req, res): void => {
  res.status(200).json({ message: "hello world" });
  return;
});

app.use("/api/workouts", workoutRouter);

function start(): void {
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}

export { start, app };
