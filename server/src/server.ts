import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwtDecode from "jwt-decode";
import cors from "cors";
import compression from "compression";
import workoutRouter from "./resources/workout/workout.router";
import { CustomRequest, JwtPayload } from "./types";
import * as exceptions from "./exceptions";
import * as middlewares from "./middlewares";
import * as jwt from "./utils/jwt";
import baseConfig from "./config";

const prisma = new PrismaClient();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: baseConfig.origin,
  })
);
app.use(compression());

app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

interface AuthBody {
  username: string;
  password: string;
}

app.post("/login", async (req: CustomRequest<AuthBody>, res, next) => {
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

    const decodedToken = jwtDecode<JwtPayload>(token);
    const expiresAt = decodedToken.exp;

    res.status(200).json({
      data: { userInfo: { username: user.username }, expiresAt, token },
    });

    return;
  } catch (err) {
    next(err);
    return;
  }
});

app.post("/register", async (req: CustomRequest<AuthBody>, res, next) => {
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

    const decodedToken = jwtDecode<JwtPayload>(token);
    const expiresAt = decodedToken.exp;

    res.status(201).json({
      data: { userInfo: { username: user.username }, expiresAt, token },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
});

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
