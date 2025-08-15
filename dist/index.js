import express from "express";
import { handleMetrics } from "./api/metrics.js";
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc, } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";
import { handleVAlidateChirp } from "./api/validate_chirp.js";
import { config } from "./config.js";
const app = express();
const PORT = 8080;
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handleUserCreate } from "./api/user.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handleMetrics(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handleReset(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handleVAlidateChirp(req, res);
    }
    catch (err) {
        next(err);
    }
});
// USER APIS
app.post("/api/users", async (req, res, next) => {
    try {
        await handleUserCreate(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.use(middlewareErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
