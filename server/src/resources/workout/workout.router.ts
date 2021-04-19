import { Router, Request, Response } from "express";
import { CustomRequest, Workout } from "../../types";
// import { CustomRequest } from "../../types";

const router = Router();

// interface WorkoutsResponse {
//   data: {
//     workouts: Workout[];
//   };
// }

router
  .route("/")
  .get(
    async (req: Request, res: Response): Promise<void> => {
      const workouts = await req.prisma.workout.findMany({
        take: 10,
        include: { exercises: {} },
      });
      res.status(200).json({ data: { workouts } });
      return;
    }
  )
  .post((req: Request, res: Response): void => {
    res.status(201).end();
    return;
  });

export default router;
