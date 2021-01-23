import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config";
import workoutRouter from "./resources/workout/workout.router";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
