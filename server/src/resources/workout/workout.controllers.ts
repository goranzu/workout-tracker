import { Request, Response, NextFunction } from "express";
import { UserInputException } from "../../exceptions";
import { CustomRequest, Workout } from "../../types";

async function getWorkouts(req: Request, res: Response, next: NextFunction) {
  try {
    const workouts = await req.prisma.workout.findMany({
      where: { userId: req.userId },
      include: { exercises: true },
      take: 20,
    });

    res.status(200).json({ data: { workouts } });
    return;
  } catch (error) {
    next(error);
  }
}

async function createWorkout(
  req: CustomRequest<Workout>,
  res: Response,
  next: NextFunction
) {
  try {
    let { workoutType, exercises, duration, userInputDate } = req.body;

    if (workoutType == null || exercises == null || duration == null || userInputDate == null) {
      throw new UserInputException();
    }

    duration = Number(duration);

    if (workoutType === "cardio") {
      // TODO: Handle cardio
    }

    const dbResponse = await req.prisma.workout.create({
      data: {
        duration,
        workoutType,
        userInputDate,
        user: {
          connect: { id: req.userId },
        },
        exercises: {
          create: exercises,
        },
      },
      include: {
        exercises: true,
      },
    });

    const exer = dbResponse.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      repsPerSet: ex.repsPerSet,
      weightLifted: ex.weightLifted,
    }));

    res.status(201).json({
      data: {
        workoutType: dbResponse.workoutType,
        duration: dbResponse.duration,
        createdAt: dbResponse.createdAt,
        exercises: exer,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
}

export { getWorkouts, createWorkout };
