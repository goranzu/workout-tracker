import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/server";
import argon from "argon2";
import { getSessionCookie } from "./auth.test";

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
  const hashedPassword = await argon.hash("password");
  await prisma.user.create({
    data: { username: "seed", password: hashedPassword },
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
      .set("Cookie", [cookies]);
    expect(response.status).toBe(201);
  });
});
