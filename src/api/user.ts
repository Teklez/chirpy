import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createUser, findUserByEmail } from "../db/queries/users.js";
import { NewUser, UserResponse } from "../db/schema.js";
import { checkPasswordHash, hashPassword } from "../auth.js";

export async function handleUserCreate(req: Request, res: Response) {
  const email: string = req.body.email;
  const password: string = req.body.password;
  const hashedPassword = await hashPassword(password);
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  if (!password) {
    throw new BadRequestError("Password is required");
  }

  const newUser: NewUser = {
    email,
    password: hashedPassword,
  };

  const user: UserResponse = await createUser(newUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  res.status(201).json(user);
}

export async function handleUserLogin(req: Request, res: Response) {
  const param = req.body;

  const password = param.password;
  const email = param.email;
  if (!password) {
    throw new BadRequestError("Password is required");
  }
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} doesn't exist`);
  }
  const isPasswordCorrect = await checkPasswordHash(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Incorrect email or password");
  }
  const userWithoutPassword: UserResponse = user;
  res.status(200).json(userWithoutPassword);
}
