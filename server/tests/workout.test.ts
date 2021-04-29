import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/server";
import { getSessionCookie } from "./auth.test";
import { Workout } from "../src/types";
import { initializeUser, clearUsersFromDb, testUser } from "./auth.test";

const liftingWorkout: Workout = {
  workoutType: "lifting",
  duration: 1,
  userInputDate: new Date(),
  exercises: [
    {
      name: "pull ups",
      repsPerSet: 5,
      sets: 4,
      weightLifted: 0,
    },
    {
      name: "push ups",
      repsPerSet: 15,
      sets: 4,
      weightLifted: 0,
    },
    {
      name: "side raises",
      repsPerSet: 12,
      sets: 4,
      weightLifted: 10,
    },
    {
      name: "tricep extensions",
      repsPerSet: 12,
      sets: 2,
      weightLifted: 7,
    },
    {
      name: "bicep curls",
      repsPerSet: 12,
      sets: 2,
      weightLifted: 7,
    },
  ],
};

interface Response extends supertest.Response {
  body: {
    data?: {
      userInfo: { username: string };
    };
    error?: {
      message: string;
      path: string;
    };
  };
}

const request = supertest(app);

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Workout", () => {
  let cookies;

  beforeEach(async () => {
    await clearUsersFromDb();
    await prisma.exercise.deleteMany({ where: {} });
    await prisma.workout.deleteMany({ where: {} });
    await initializeUser();
    cookies = await getSessionCookie(request);
  });

  test("should return 201 when creating a workout", async () => {
    const response = await request
      .post("/api/workout")
      .send(liftingWorkout)
      .set("Cookie", [cookies]);
    expect(response.status).toBe(201);
  });

  test("should create a workout in the database", async () => {
    const response = await request
      .post("/api/workout")
      .send(liftingWorkout)
      .set("Cookie", [cookies]);
    const workout = await prisma.workout.findFirst({
      where: { user: { username: testUser.username } },
    });
    expect(workout).toBeTruthy();
  });

  test("should return the new workout in the response", async () => {
    const response = await request
      .post("/api/workout")
      .send(liftingWorkout)
      .set("Cookie", [cookies]);

    expect(response.body.data.date).toBeTruthy();
    expect(Array.isArray(response.body.data.exercises)).toBeTruthy();
  });

  test("should return 200 when getting the users workouts", async () => {
    const response = await request.get("/api/workout").set("Cookie", [cookies]);

    expect(response.status).toBe(200);
  });

  test("should return the new workout in the response", async () => {
    await request
      .post("/api/workout")
      .send(liftingWorkout)
      .set("Cookie", [cookies]);

    const response = await request.get("/api/workout").set("Cookie", [cookies]);

    expect(Array.isArray(response.body.data.workouts)).toBeTruthy();
    expect(
      Array.isArray(response.body.data.workouts[0].exercises),
    ).toBeTruthy();
  });

  test("should return an empty array is no workouts in the database", async () => {
    const response = await request.get("/api/workout").set("Cookie", [cookies]);

    expect(Array.isArray(response.body.data.workouts)).toBeTruthy();
    expect(response.body.data.workouts).toHaveLength(0);
  });
});
