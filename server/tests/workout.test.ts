import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/server";
import argon from "argon2";
import { getSessionCookie } from "./auth.test";
import { Workout } from "../src/types";

const liftingWorkout: Workout = {
  workoutType: "lifting",
  duration: 1,
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

const testUser = {
  username: "seed",
  password: "password",
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

beforeAll(async () => {});

let cookies;

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany({ where: {} });
  const hashedPassword = await argon.hash(testUser.password);
  await prisma.user.create({
    data: { username: testUser.username, password: hashedPassword },
  });
  cookies = await getSessionCookie(request);
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Workout", () => {
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
    expect(response.body.data.createdAt).toBeTruthy();
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
      Array.isArray(response.body.data.workouts[0].exercises)
    ).toBeTruthy();
  });

  test.only("should return an empty array is no workouts in the database", async () => {
    const response = await request.get("/api/workout").set("Cookie", [cookies]);

    expect(Array.isArray(response.body.data.workouts)).toBeTruthy();
    expect(response.body.data.workouts).toHaveLength(0);
  });
});
