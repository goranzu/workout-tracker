import { PrismaClient } from "@prisma/client";
import { PrismaDelete } from "@paljs/plugins";
import supertest from "supertest";
import { app } from "../src/server";
import argon from "argon2";
import * as jwt from "../src/utils/jwt";

const BASE_URL = "/auth";

interface Response extends supertest.Response {
  body: {
    data?: {
      token: string;
    };
    error?: {
      message: string;
    };
  };
}

const REGISTER_URL = `${BASE_URL}/register`;
const LOGIN_URL = `${BASE_URL}/login`;
const PROTECT_URL = `/protect`;
const request = supertest(app);

const prisma = new PrismaClient();
const prismaDelete = new PrismaDelete();

async function cascadeDelete(model: string, where = {}): Promise<void> {
  await prismaDelete.onDelete({ model, where });
  await prisma.user.deleteMany({ where });
}

afterEach(async () => {
  await cascadeDelete("User");
});

afterAll(async () => {
  await cascadeDelete("User");
});

const user = {
  username: "liam",
  password: "liam",
};

describe("Login", () => {
  beforeEach(async () => {
    const hashedPassword = await argon.hash("password");
    await prisma.user.create({
      data: {
        username: "seed",
        password: hashedPassword,
      },
    });
  });
  test("should return 201 when login is successfull", async () => {
    const response: Response = await request
      .post(LOGIN_URL)
      .send({ username: "seed", password: "password" });
    expect(response.status).toBe(201);
  });
  test("should return a token if the login is successfull", async () => {
    const response: Response = await request
      .post(LOGIN_URL)
      .send({ username: "seed", password: "password" });
    expect(response.body.data.token).toBeTruthy();
  });
  test("should return 400 if user input is not valid", async () => {
    const response: Response = await request.post(LOGIN_URL).send({});
    expect(response.status).toBe(400);
  });
  test("should return 401 if the user is not registered", async () => {
    const response: Response = await request
      .post(LOGIN_URL)
      .send({ username: "wrong", password: "wrongwrong" });
    expect(response.status).toBe(401);
  });
  test("should return 401 if the password is incorrect", async () => {
    const response: Response = await request
      .post(LOGIN_URL)
      .send({ username: "seed", password: "wrongwrong" });
    expect(response.status).toBe(401);
  });
});

describe("Register", () => {
  test("should return 201 when registration is successfull", async (done) => {
    const response: Response = await request.post(REGISTER_URL).send(user);

    expect(response.status).toBe(201);
    done();
  });
  test("should return 400 if user input is not valid", async (done) => {
    const response: Response = await request.post(REGISTER_URL).send({});

    expect(response.status).toBe(400);
    done();
  });
  test("should save the user in the database", async (done) => {
    await request.post(REGISTER_URL).send(user);

    const u = await prisma.user.findFirst({
      where: {
        username: "liam",
      },
    });

    expect(u).toBeTruthy();
    expect(u?.password).not.toEqual(user.password);
    done();
  });
  test("should send a jwt after successfull registration", async (done) => {
    const response: Response = await request.post(REGISTER_URL).send(user);

    expect(response.body.data.token).toBeTruthy();
    done();
  });
});

describe("Protect Middleware", () => {
  test("should return 401 if Authorization header is not in the request", async (done) => {
    const response = await request.get(PROTECT_URL);
    expect(response.status).toBe(401);
    done();
  });
  test("should return 401 if Authorization header does not start with 'Bearer '", async (done) => {
    const response = await request
      .get(PROTECT_URL)
      .set("Authorization", "whatever");
    expect(response.status).toBe(401);
    done();
  });
  test("should return 401 if jwt token is not valid", async (done) => {
    const response = await request
      .get(PROTECT_URL)
      .set("Authorization", "Bearer ailsjdliasmnfilnflisdnf");
    expect(response.status).toBe(401);
    done();
  });
  test("should return the username of the user if the jwt token is valid", async (done) => {
    const token = jwt.signToken({ id: "12", username: "liam" });
    const response = await request
      .get(PROTECT_URL)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    done();
  });
});
