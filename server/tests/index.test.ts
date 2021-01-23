import request from "supertest";
import { app } from "../src/server";
import { Workout } from "../src/types";

interface MyResponse extends request.Response {
  body: {
    data?: {
      workouts: [];
    };
  };
}

const BASE_URL = "/api/workouts";

const workout: Workout = {
  type: "cardio",
  duration: 1,
  exercise: [{ name: "jogging", distance: 4 }],
};

describe("Workouts", () => {
  test("Create a lifting workout", async () => {
    const response: MyResponse = await request(app)
      .post(BASE_URL)
      .send({ ...workout });

    expect(response.status).toBe(201);
    expect(response.body.data?.workouts).toHaveLength(1);
  });

  test("Get all workouts", async () => {
    const response: MyResponse = await request(app).get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body.data?.workouts).toHaveLength(0);
  });
});
