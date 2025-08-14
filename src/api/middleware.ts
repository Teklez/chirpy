import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
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
