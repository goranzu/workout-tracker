import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/server";
import argon from "argon2";

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

beforeEach(async () => {
  const hashedPassword = await argon.hash("password");
  await prisma.user.create({
    data: {
      username: "seed",
      password: hashedPassword,
    },
  });
});

afterEach(async () => {
  await prisma.user.deleteMany({ where: {} });
});

const user = {
  username: "liam",
  password: "liam",
};

describe("Login", () => {
  test("should return 201 when login is successfull", async () => {
    const response: Response = await request
      .post("/login")
      .send({ username: "seed", password: "password" });
    expect(response.status).toBe(200);
  });

  test("should return 400 if user input is not valid", async () => {
    const response: Response = await request.post("/login").send({});
    expect(response.status).toBe(400);
  });
  test("should return 401 if the user is not registered", async () => {
    const response: Response = await request
      .post("/login")
      .send({ username: "wrong", password: "wrongwrong" });
    expect(response.status).toBe(401);
  });
  test("should return 401 if the password is incorrect", async () => {
    const response: Response = await request
      .post("/login")
      .send({ username: "seed", password: "wrongwrong" });
    expect(response.status).toBe(401);
  });
});

describe("Register", () => {
  test("should return 201 when registration is successfull", async () => {
    const response: Response = await request.post("/register").send(user);

    expect(response.status).toBe(201);
  });
  test("should return 400 if user input is not valid", async () => {
    const response: Response = await request.post("/register").send({});

    expect(response.status).toBe(400);
  });
  test("should save the user in the database", async () => {
    await request.post("/register").send(user);

    const u = await prisma.user.findFirst({
      where: {
        username: "liam",
      },
    });

    expect(u).toBeTruthy();
    expect(u?.password).not.toEqual(user.password);
  });
});
