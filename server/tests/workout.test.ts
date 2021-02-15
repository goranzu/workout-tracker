import { PrismaClient } from "@prisma/client";
import { PrismaDelete } from "@paljs/plugins";
import supertest from "supertest";
import { app } from "../src/server";
import { Workout } from "../src/types";

const BASE_URL = "/api/workouts";

const request = supertest(app);

const prisma = new PrismaClient();
const prismaDelete = new PrismaDelete();

interface MyPostResponse extends supertest.Response {
  body: {
    data?: {
      workouts: Workout[];
    };
  };
}

// const workout: Workout = {
//   workoutType: "cardio",
//   duration: 1,
//   exercises: [{ name: "jogging", distance: 4 }],
// };

async function cascadeDelete(model: string, where = {}): Promise<void> {
  await prismaDelete.onDelete({ model: "Workout", where: {} });
  await prisma.workout.deleteMany({ where: {} });
}

afterEach(async () => {
  await cascadeDelete("Workout");
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
          create: [
            {
              name: "jogging",
              distance: 4.5,
            },
            {
              name: "sprinting",
              distance: 0.5,
            },
          ],
        },
      },
    });

    const response: MyPostResponse = await request.get(BASE_URL);
    expect(response.status).toBe(200);
    const workouts = response.body.data?.workouts;
    expect(workouts).toHaveLength(1);
    expect(workouts![0].exercises?.length).toBe(2);
    done();
  });
});
