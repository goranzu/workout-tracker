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

export const testUser = {
  username: "seed",
  password: "password",
};

export async function getSessionCookie(req): Promise<any> {
  const response = await req
    .post("/login")
    .send({ username: testUser.username, password: testUser.password });
  expect(response.status).toBe(200);
  expect(response.headers).toHaveProperty("set-cookie");
  return response.headers["set-cookie"].pop().split(";")[0];
}

const request = supertest(app);

const prisma = new PrismaClient();

export async function initializeUser(): Promise<void> {
  const hashedPassword = await argon.hash(testUser.password);
  await prisma.user.create({
    data: { username: testUser.username, password: hashedPassword },
  });
}

export async function clearUsersFromDb(): Promise<void> {
  await prisma.user.deleteMany({ where: {} });
}

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Login", () => {
  beforeEach(async () => {
    await clearUsersFromDb();
    await initializeUser();
  });

  test("should return 201 when login is successfull", async () => {
    const response: Response = await request
      .post("/login")
      .send({ username: testUser.username, password: testUser.password });
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
      .send({ username: testUser.username, password: "wrongwrong" });
    expect(response.status).toBe(401);
  });
});

describe("Register", () => {
  const user = {
    username: "liam",
    password: "liam",
  };

  beforeEach(async () => {
    await clearUsersFromDb();
  });

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
        username: user.username,
      },
    });

    expect(u).toBeTruthy();
    expect(u?.password).not.toEqual(user.password);
  });
});

describe("Logout", () => {
  let cookies;

  beforeEach(async () => {
    await clearUsersFromDb();
    await initializeUser();
    cookies = await getSessionCookie(request);
  });

  test("should return a 204 on logout", async () => {
    const response: Response = await request
      .get("/user")
      .set("Cookie", [cookies]);
    expect(response.status).toBe(200);
  });

  test("should fail with 401 if session cookie is not present", async () => {
    const response: Response = await request.get("/user");
    expect(response.status).toBe(401);
  });
});
