import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";

export async function handleUserCreate(req: Request, res: Response) {
  const email: string = req.body.email;
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const newUser: NewUser = {
    email,
  };

  const user = await createUser(newUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  res.status(201).json(user);
}
