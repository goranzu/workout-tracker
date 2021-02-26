import express, { Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config";
import workoutRouter from "./resources/workout/workout.router";
import { PrismaClient } from "@prisma/client";
import { CustomRequest } from "./types";
import * as exceptions from "./exceptions";
import * as middlewares from "./middlewares";
import argon2 from "argon2";

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

app.post(
  "/auth/register",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (
    req: CustomRequest<{ username: string; password: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (username == null || password == null) {
        next(new exceptions.UserInputException());
        return;
      }

      const hashedPassword = await argon2.hash(password);

      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.status(201).json({ username, password });
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

app.get("/", (req, res): void => {
  res.status(200).json({ message: "hello world" });
  return;
});

app.use("/api/workouts", workoutRouter);

app.use(middlewares.errorHandler);

function start(): void {
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}

export { start, app };
