import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import workoutRouter from "./resources/workout/workout.router";
import { PrismaClient } from "@prisma/client";
import { CustomRequest } from "./types";
import * as exceptions from "./exceptions";
import * as middlewares from "./middlewares";
import * as jwt from "./utils/jwt";
import argon2 from "argon2";
import baseConfig from "./config";

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

interface AuthBody {
  username: string;
  password: string;
}

app.post(
  "/auth/login",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: CustomRequest<AuthBody>, res, next) => {
    try {
      const { username, password } = req.body;
      if (username == null || password == null) {
        throw new exceptions.UserInputException();
      }
      const user = await prisma.user.findFirst({
        where: { username },
        select: { id: true, password: true, username: true },
      });

      if (user == null) {
        throw new exceptions.UnauthorizedException();
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        throw new exceptions.UnauthorizedException();
      }

      const token = jwt.signToken({ id: user.id, username: user.username });

      res.status(201).json({ data: { token } });
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

app.post(
  "/auth/register",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: CustomRequest<AuthBody>, res, next): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (username == null || password == null) {
        throw new exceptions.UserInputException();
      }

      const hashedPassword = await argon2.hash(password);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
        select: { id: true, username: true },
      });

      const token = jwt.signToken({ id: user.id, username: user.username });

      res.status(201).json({ data: { token } });
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/protect", async function protect(req, res, next) {
  // Check if JWT is expired
  try {
    const authorization = req.headers.authorization;
    if (authorization == null) {
      throw new exceptions.UnauthorizedException();
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new exceptions.UnauthorizedException();
    }
    const token = authorization.split(" ")[1];
    let payload;
    try {
      payload = await jwt.verifyToken(token);
    } catch (error) {
      throw new exceptions.UnauthorizedException();
    }

    if (payload == null) {
      throw new exceptions.UnauthorizedException();
    }
    // find the user in db
    console.log(payload);
  } catch (err) {
    next(err);
    return;
  }
});

app.get("/", (req, res): void => {
  res.status(200).json({ message: "hello world" });
  return;
});

app.use("/api/workouts", workoutRouter);

app.use(middlewares.errorHandler);

function start(): void {
  app.listen(baseConfig.port, () => {
    console.log(`Listening on http://localhost:${baseConfig.port}`);
  });
}

export { start, app };
