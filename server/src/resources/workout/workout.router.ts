import { Router, Request, Response } from "express";
import { CustomRequest, Workout } from "../../types";

const router = Router();

interface WorkoutsResponse {
  data: {
    workouts: Workout[];
  };
}

router
  .route("/")
  .get((req: Request, res: Response): void => {
    res.status(200).json({ data: { workouts: [] } });
    return;
  })
  .post((req: CustomRequest<Workout>, res: Response): void => {
    const { type, date, duration, exercise } = req.body;
    const response: WorkoutsResponse = {
      data: { workouts: [{ type, date, duration, exercise }] },
    };
    res.status(201).json(response);
    return;
  });

export default router;
