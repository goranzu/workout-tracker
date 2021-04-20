import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { AuthBody, CustomRequest } from "./types";
import * as exceptions from "./exceptions";
import baseConfig from "./config";

function getCsrfToken(req: Request, res: Response) {
  res.status(200).json({
    data: {
      csrfToken: req.csrfToken()
    },
  });
  return;
}

async function login(
  req: CustomRequest<AuthBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;
    if (username == null || password == null) {
      throw new exceptions.UserInputException();
    }
    const user = await req.prisma.user.findFirst({
      where: { username },
      select: { id: true, password: true, username: true },
    });

    if (user == null) {
      throw new exceptions.UnauthorizedException();
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new exceptions.UnauthorizedException();
    }

    req.session.userId = user.id;

    res.status(200).json({
      data: { userInfo: { username: user.username, id: user.id } },
    });

    return;
  } catch (err) {
    next(err);
    return;
  }
}

async function register(
  req: CustomRequest<AuthBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;
    if (username == null || password == null) {
      throw new exceptions.UserInputException();
    }

    const hashedPassword = await argon2.hash(password);

    const user = await req.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: { id: true, username: true },
    });

    req.session.userId = user.id;

    res.status(201).json({
      data: { userInfo: { username: user.username, id: user.id } },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
}

function logout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy((err) => {
    res.clearCookie(baseConfig.cookieName);
    if (err) {
      next(err);
      return;
    }
    res.status(204).end();
    return;
  });
}

async function user(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.session;
    const user = await req.prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new exceptions.UnauthorizedException();
    }

    const userInfo = { username: user.username, id: user.id };

    res.status(200).json({ data: userInfo });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export { getCsrfToken, login, logout, register, user };
