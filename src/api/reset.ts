import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { resetUsers } from "src/db/queries/users.js";

export async function handleReset(_: Request, res: Response) {
  if (config.platform != "dev") {
    throw new ForbiddenError("Not allowed!");
  }
  config.fileserverHits = 0;
  await resetUsers();

  res.send("Successfully reset");
  res.status(200);
  res.end();
}
