import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from "./errors.js";
import { error } from "console";
export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  _: Response,
  next: NextFunction
) {
  config.fileserverHits = config.fileserverHits + 1;

  next();
}

export function middlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Something went wrong on our end";
  if (err instanceof BadRequestError) {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    errorMessage = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    errorMessage = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    errorMessage = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }
  res.status(statusCode).json({
    error: errorMessage,
  });
}
