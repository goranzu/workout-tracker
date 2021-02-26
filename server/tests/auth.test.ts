import { PrismaClient } from "@prisma/client";
import { PrismaDelete } from "@paljs/plugins";
import supertest from "supertest";
import { app } from "../src/server";

const BASE_URL = "/auth";

interface RegisterResponse extends supertest.Response {
  body: {
    data?: {
      username: string;
      password: string;
    };
    error?: {
      message: string;
    };
  };
}

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

describe("Register", () => {
  const user = {
    username: "liam",
    password: "liam",
  };
  const REGISTER_URL = `${BASE_URL}/register`;

  test("should return 201 when registration is successfull", async (done) => {
    const response: RegisterResponse = await request
      .post(REGISTER_URL)
      .send(user);

    expect(response.status).toBe(201);
    done();
  });

  test("should return 400 if user input is not valid", async (done) => {
    const response: RegisterResponse = await request
      .post(REGISTER_URL)
      .send({});

    expect(response.status).toBe(400);
    done();
  });

  test("should respond with an error message if user input is not valid", async (done) => {
    const response: RegisterResponse = await request
      .post(REGISTER_URL)
      .send({});

    expect(response.body.error?.message).toBe("Invalid Input");
    done();
  });

  test("should save the user in the database", async (done) => {
    await request.post(REGISTER_URL).send(user);

    const u = await prisma.user.findFirst({
      where: {
        username: "liam",
      },
    });

    console.log(u);

    expect(u).toBeTruthy();
    expect(u?.password).not.toEqual(user.password);
    done();
  });
});
