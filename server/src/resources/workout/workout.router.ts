import { Router } from "express";
import * as workoutControllers from "./workout.controllers";

const router = Router();

router
  .route("/")
  .get(workoutControllers.getWorkouts)
  .post(workoutControllers.createWorkout);

export default router;
