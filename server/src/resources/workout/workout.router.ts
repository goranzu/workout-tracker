import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types";

const router = Router();

// interface WorkoutsResponse {
//   data: {
//     workouts: Workout[];
//   };
// }

router.route("/").get(
  async (req: Request, res: Response): Promise<void> => {
    const workouts = await req.prisma.workout.findMany({ take: 10 });
    res.status(200).json({ data: { workouts } });
    return;
  },
);
// .post((req: CustomRequest<Workout>, res: Response): void => {
//   const { type, date, duration, exercise } = req.body;
//   const response: WorkoutsResponse = {
//     data: { workouts: [{ type, date, duration, exercise }] },
//   };
//   res.status(201).json(response);
//   return;
// });

export default router;
