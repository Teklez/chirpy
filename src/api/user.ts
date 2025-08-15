import { Request, Response } from "express";
import { BadRequestError } from "./errors";
import { createUser } from "src/db/queries/users";
import { NewUser } from "src/db/schema";

export async function handleUserCreate(req: Request, res: Response) {
  const email: string = req.body.email;
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const newUser: NewUser = {
    email,
  };

  const user = await createUser(newUser);
  if (user) {
    res.status(201).json(user);
  }
}
