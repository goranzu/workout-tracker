import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import workoutRouter from "./resources/workout/workout.router";
import * as middlewares from "./middlewares";
import * as authControllers from "./auth.controllers";
import baseConfig from "./config/index";

const prisma = new PrismaClient();
const RedisStore = connectRedis(session);
const redisClient = new Redis();

const app = express();

app.use(
  session({
    store: new RedisStore({ client: redisClient, disableTouch: true }),
    saveUninitialized: false,
    resave: false,
    secret: baseConfig.sessionSecret!,
    name: baseConfig.cookieName,
    cookie: {
      httpOnly: true,
      secure: baseConfig.isProd,
      sameSite: "lax",
      maxAge: baseConfig.cookieMaxAge,
    },
  })
);

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: baseConfig.origin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(compression());

const csrfProtection = csurf({
  cookie: true,
});

if (baseConfig.isProd || baseConfig.isDev) {
  app.use(csrfProtection);
}

app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

app.get("/csrf-token", authControllers.getCsrfToken);

app.post("/login", authControllers.login);

app.post("/register", authControllers.register);

app.delete("/logout", middlewares.protect, authControllers.logout);

app.get("/user", middlewares.protect, authControllers.user);

app.use("/api", middlewares.protect);

app.use("/api/workout", workoutRouter);

app.use(middlewares.errorHandler);

function start(): void {
  app.listen(baseConfig.port, () => {
    console.log(`Listening on http://localhost:${baseConfig.port}`);
  });
}

export { start, app };
