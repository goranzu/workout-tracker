import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.test") });

import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/server";
// import { Workout } from "../src/types";

interface MyResponse extends supertest.Response {
  body: {
    data?: {
      workouts: [];
    };
  };
}

const BASE_URL = "/api/workouts";

const request = supertest(app);

const prisma = new PrismaClient();

// const workout: Workout = {
//   type: "cardio",
//   duration: 1,
//   exercise: [{ name: "jogging", distance: 4 }],
// };

afterEach(async () => {
  await prisma.exercise.deleteMany({});
  await prisma.workout.deleteMany({});
});

describe("Workouts", () => {
  // test("Create a lifting workout", async () => {
  //   const response: MyResponse = await request
  //     .post(BASE_URL)
  //     .send({ ...workout });

  //   expect(response.status).toBe(201);
  //   expect(response.body.data?.workouts).toHaveLength(1);
  // });

  test("Get all workouts", async (done) => {
    await prisma.workout.create({
      data: {
        duration: 1,
        workoutType: "cardio",
        exercises: {
          create: {
            name: "jogging",
            distance: 4.5,
          },
        },
      },
    });

    const response: MyResponse = await request.get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body.data?.workouts).toHaveLength(1);
    done();
  });
});
