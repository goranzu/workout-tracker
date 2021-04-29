import { Request, Response, NextFunction } from "express";
import { UserInputException } from "../../lib/exceptions";
import { CustomRequest, Workout } from "../../types";

async function getWorkouts(req: Request, res: Response, next: NextFunction) {
  try {
    const tempWorkouts = await req.prisma.workout.findMany({
      where: { userId: req.userId },
      include: { exercises: true },
    });
    const workouts = tempWorkouts.map(
      ({ userInputDate, duration, workoutType, exercises, id }) => ({
        id,
        date: userInputDate,
        duration,
        workoutType,
        exercises: exercises.map(
          ({ name, sets, repsPerSet, distance, weightLifted, id }) => ({
            id,
            name,
            sets,
            repsPerSet,
            distance,
            weightLifted,
          }),
        ),
      }),
    );
    res.status(200).json({ data: { workouts } });
    return;
  } catch (error) {
    next(error);
  }
}

async function createWorkout(
  req: CustomRequest<Workout>,
  res: Response,
  next: NextFunction,
) {
  try {
    let { workoutType, exercises, duration, userInputDate } = req.body;

    if (
      workoutType == null ||
      exercises == null ||
      duration == null ||
      userInputDate == null
    ) {
      throw new UserInputException();
    }

    duration = Number(duration);
    userInputDate = new Date(userInputDate);
    exercises = exercises.map((ex) => {
      if (typeof ex.distance === "string") {
        ex.distance = Number(ex.distance);
      }
      return ex;
    });

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
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      repsPerSet: ex.repsPerSet,
      weightLifted: ex.weightLifted,
    }));

    res.status(201).json({
      data: {
        id: dbResponse.id,
        workoutType: dbResponse.workoutType,
        duration: dbResponse.duration,
        date: dbResponse.userInputDate,
        exercises: exer,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
}

export { getWorkouts, createWorkout };
