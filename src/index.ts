import express, { NextFunction, Request, Response } from "express";
import { handleMetrics } from "./api/metrics.js";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";
import { config } from "./config.js";
const app = express();
const PORT = 8080;

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import {
  handleChirpCreate,
  handleGetChirps,
  handleGetChirpsByID,
} from "./api/chirps.js";
import { handleUserCreate } from "./api/user.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get(
  "/api/healthz",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerReadiness(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/admin/metrics",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleMetrics(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/admin/reset",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleReset(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// USER APIS

app.post(
  "/api/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleUserCreate(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// CHIRPS ENDPOINT
app.post(
  "/api/chirps",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleChirpCreate(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/api/chirps",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetChirps(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/api/chirps/:chirpID",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetChirpsByID(req, res);
    } catch (err) {
      next(err);
    }
  }
);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
